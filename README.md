# 电力市场 SCED/LMP AI 教学问答系统

基于三节点 DC-SCED 演示器的 AI 教学助手。所有数值计算由浏览器确定性完成，AI 只负责解释和回答追问。

## 快速启动

```bash
# 1. 进入项目目录
cd e:\codes\lmp

# 2. 启动本地代理（零依赖，无需 npm install）
node server.js

# 3. 浏览器打开
# http://127.0.0.1:8765
```

## 配置 AI 模型

在页面底部 AI 助教面板中点击 **⚙** 按钮，填写：

| 字段 | DeepSeek 示例 | OpenAI 示例 | 硅基流动示例 |
|------|--------------|------------|-------------|
| Base URL | `https://api.deepseek.com` | `https://api.openai.com` | `https://api.siliconflow.cn` |
| Model | `deepseek-chat` | `gpt-4o` | `Qwen/Qwen2.5-72B-Instruct` |
| API Key | `sk-xxx` | `sk-xxx` | `sk-xxx` |

- **Temperature** 默认 0.2（低温度减少幻觉）
- API Key 默认存 sessionStorage（关闭标签页即丢失）
- 勾选"记住 Key"后才写 localStorage

## 项目结构

```
lmp/
├── sced_and_lmp_educational_system.html   # 主页面（HTML + CSS + JS 一体）
├── server.js                              # 本地代理服务（Node.js 原生 http，零依赖）
├── package.json                           # 项目描述
├── README.md                              # 本文件
└── old/                                   # 历史版本（勿动）
    ├── index.html
    ├── styles.css
    └── app.js
```

## 架构说明

```
浏览器 (HTML)                     本地代理 (server.js)              LLM API
┌──────────────┐    POST /api/chat    ┌──────────────┐    POST /v1/chat    ┌──────────┐
│ buildTeaching │ ──────────────────→  │  参数校验     │ ──────────────────→ │ DeepSeek │
│ Context()     │                      │  Key 脱敏日志 │                     │ OpenAI   │
│               │ ←──────────────────  │  错误转发     │ ←────────────────── │ 兼容接口  │
│ 渲染回答       │    JSON response     └──────────────┘    JSON response    └──────────┘
└──────────────┘
```

**核心原则**：所有 SCED 求解、PTDF 计算、LMP 扰动推导由浏览器 JS 完成（确定性、可追溯）。AI 只接收计算结果的结构化快照（teachingContext），负责解释、教学、回答追问。

## API 接口

### GET /health
```json
{"status": "ok", "time": "2026-06-22T12:00:00.000Z", "index": "sced_and_lmp_educational_system.html"}
```

### POST /api/chat
```json
{
  "baseUrl": "https://api.deepseek.com",
  "apiKey": "sk-...",
  "model": "deepseek-chat",
  "temperature": 0.2,
  "messages": [
    {"role": "system", "content": "系统提示词..."},
    {"role": "system", "content": "teachingContext JSON..."},
    {"role": "user", "content": "节点 B 的 LMP 怎么算？"}
  ]
}
```

错误响应示例：
```json
{"error": "缺少 apiKey"}
{"error": "上游返回 401: Authentication Fails..."}
{"error": "上游请求超时（30s）"}
```

## 教学上下文 (teachingContext)

每次用户提问时，前端自动从当前页面计算状态提取以下字段发送给 AI：

- `scenario` — 当前场景名（base/congestion/negative/surplus）
- `inputs` — 机组报价/容量、负荷、线路参数/限额
- `solution` — GA/GB/GC 出力、总成本
- `lmp` — 三个节点 LMP 值
- `flows` — 三条线路潮流
- `ptdf` — 6 个 PTDF 系数
- `bindingConstraints` — 绑定约束列表
- `totalLoadPaid` / `totalGenPaid` — 用电侧支付 / 发电侧结算
- `congestionRent` — 阻塞盈余
- `marginalGenerator` — 边际机组标识
- `perturbation` — LMP 扰动计算的原始数据（delta、base cost、各节点扰动后 cost）
- `scenarioExplanation` — 当前场景的教学说明文本

## 预设问题

面板内置 8 个快捷问题，覆盖：
1. LMP 计算过程
2. 节点电价分裂原因
3. 拥塞价格形成机制
4. PTDF 物理含义
5. 成本计算
6. 机组启停扩展方向
7. 负电价成因
8. 手算教学

## 注意事项

- 本项目无前端框架依赖，纯原生 HTML/CSS/JS
- server.js 零 npm 依赖，仅用 Node.js 内置模块
- API Key 不写入任何服务端文件或日志（日志中 key 显示为 `sk-xxxx***`）
- 本系统采用 DC 潮流（直流近似），不含网损、无功、电压约束
- SCED 通过顶点枚举求解（3 节点问题等价于 2D 线性规划）
- LMP 通过数值扰动（有限差分）计算，非拉格朗日乘子法
