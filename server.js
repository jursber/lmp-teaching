const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8765;
const TIMEOUT_MS = 30000;

// 静态文件 MIME
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
};

// 教学主页（自动查找目录中唯一的 HTML 文件）
function findIndexHtml() {
    const files = fs.readdirSync(__dirname);
    const html = files.filter(f => f.endsWith(".html") && !f.startsWith(".") && f !== "old");
    return html[0] || null;
}

const INDEX_HTML = findIndexHtml();

// 读取请求体
function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on("data", chunk => {
            size += chunk.length;
            if (size > 2 * 1024 * 1024) { // 2MB 上限
                reject(new Error("请求体过大"));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        req.on("error", reject);
    });
}

// 代理请求到 LLM API
function proxyToLLM(body) {
    return new Promise((resolve, reject) => {
        let parsedUrl;
        try {
            parsedUrl = new URL(body.baseUrl);
        } catch (e) {
            const err = new Error("baseUrl 不合法：" + body.baseUrl);
            err.statusCode = 400;
            return reject(err);
        }

        if (!parsedUrl.protocol.startsWith("http")) {
            const err = new Error("baseUrl 必须是 http/https 协议");
            err.statusCode = 400;
            return reject(err);
        }

        const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "");
        const apiPath = normalizedPath.endsWith("/v1")
            ? normalizedPath + "/chat/completions"
            : normalizedPath + "/v1/chat/completions";
        const isStream = !!body.stream;
        const payload = JSON.stringify({
            model: body.model || "deepseek-chat",
            messages: body.messages,
            temperature: body.temperature !== undefined ? body.temperature : 0.2,
            max_tokens: 2048,
            stream: isStream,
        });

        const isHttps = parsedUrl.protocol === "https:";
        const transport = isHttps ? https : http;

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: apiPath,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + body.apiKey,
                "Content-Length": Buffer.byteLength(payload),
            },
            timeout: TIMEOUT_MS,
        };

        // 日志脱敏
        const maskedKey = body.apiKey ? body.apiKey.slice(0, 6) + "***" : "(empty)";
        console.log(`[${new Date().toISOString()}] → LLM: ${parsedUrl.host}${apiPath} | model=${body.model} | key=${maskedKey}`);

        const proxyReq = transport.request(options, (proxyRes) => {
            const ct = proxyRes.headers["content-type"] || "";
            const isSSE = ct.includes("text/event-stream");

            // 流式 + 上游确实是 SSE → 直接透传
            if (isStream && isSSE && proxyRes.statusCode === 200) {
                console.log(`[${new Date().toISOString()}] ← LLM stream (SSE)`);
                resolve({ _stream: true, res: proxyRes });
                return;
            }

            // 其他情况（非流式，或上游不支持 SSE，或出错）→ 收集完整响应
            const respChunks = [];
            proxyRes.on("data", chunk => respChunks.push(chunk));
            proxyRes.on("end", () => {
                const respBody = Buffer.concat(respChunks).toString("utf-8");

                if (proxyRes.statusCode !== 200) {
                    let errMsg = `上游返回 ${proxyRes.statusCode}`;
                    try {
                        const errJson = JSON.parse(respBody);
                        errMsg += ": " + (errJson.error?.message || errJson.message || respBody.slice(0, 200));
                    } catch (e) {
                        errMsg += ": " + respBody.slice(0, 200);
                    }
                    console.error(`[${new Date().toISOString()}] ✗ LLM error: ${errMsg}`);
                    return reject(new Error(errMsg));
                }

                try {
                    const data = JSON.parse(respBody);
                    console.log(`[${new Date().toISOString()}] ← LLM: tokens=${data.usage?.total_tokens || "?"}`);
                    resolve(data);
                } catch (e) {
                    reject(new Error("上游响应非合法 JSON"));
                }
            });
        });

        proxyReq.on("timeout", () => {
            proxyReq.destroy();
            reject(new Error("上游请求超时（" + TIMEOUT_MS / 1000 + "s）"));
        });

        proxyReq.on("error", (e) => {
            reject(new Error("无法连接上游：" + e.message));
        });

        proxyReq.write(payload);
        proxyReq.end();
    });
}

// 静态文件服务
function serveStatic(req, res) {
    let filePath = new URL(req.url, "http://localhost").pathname;
    if (filePath === "/" && INDEX_HTML) {
        filePath = "/" + INDEX_HTML;
    }

    const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
    const fullPath = path.join(__dirname, safePath);

    if (!fullPath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }
        const ext = path.extname(fullPath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
    });
}

// CORS 头
function setCORS(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// JSON 响应
function jsonRes(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
}

// 主服务
const server = http.createServer(async (req, res) => {
    setCORS(res);

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const pathname = new URL(req.url, "http://localhost").pathname;

    // 健康检查
    if (pathname === "/health" && req.method === "GET") {
        jsonRes(res, 200, { status: "ok", time: new Date().toISOString(), index: INDEX_HTML || "(none)" });
        return;
    }

    // 聊天代理
    if (pathname === "/api/chat" && req.method === "POST") {
        try {
            const raw = await readBody(req);
            let body;
            try {
                body = JSON.parse(raw);
            } catch (e) {
                jsonRes(res, 400, { error: "请求体非合法 JSON" });
                return;
            }

            if (!body.apiKey) {
                jsonRes(res, 400, { error: "缺少 apiKey" });
                return;
            }
            if (!body.baseUrl) {
                jsonRes(res, 400, { error: "缺少 baseUrl" });
                return;
            }
            if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
                jsonRes(res, 400, { error: "缺少 messages 数组" });
                return;
            }

            const data = await proxyToLLM(body);

            // 流式模式：直接透传 SSE
            if (data._stream) {
                res.writeHead(200, {
                    "Content-Type": "text/event-stream; charset=utf-8",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                });
                data.res.pipe(res);
                return;
            }

            jsonRes(res, 200, data);
        } catch (e) {
            jsonRes(res, e.statusCode || 502, { error: e.message });
        }
        return;
    }

    // 静态文件
    if (req.method === "GET") {
        serveStatic(req, res);
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log("====================================");
    console.log(`  LMP AI 教学系统已启动`);
    console.log(`  http://127.0.0.1:${PORT}`);
    console.log(`  /health  — 健康检查`);
    console.log(`  /api/chat — LLM 代理`);
    if (INDEX_HTML) {
        console.log(`  主页: ${INDEX_HTML}`);
    } else {
        console.log(`  ⚠ 未找到 HTML 文件`);
    }
    console.log("====================================");
});
