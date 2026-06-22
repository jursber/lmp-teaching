
        function clearAiChat() {
            aiChatHistory = [];
            setDefaultAiContent(currentActiveScenario);
        }

        function setDefaultAiContent(scenarioKey) {
            const exp = scenarioExplanations[scenarioKey];
            if (!exp) return;
            aiChatHistory = [];
            const box = document.getElementById('ai_messages');
            if (!box) return;
            box.innerHTML = '';

            const html = [
                '<div style="color:var(--cyan);font-weight:800;margin-bottom:8px;">' + exp.badge + '</div>',
                '<h3 style="margin:0 0 8px;color:var(--ink);font-size:13px;">鍏堟妸杩欑粍鏁版嵁鎸夆€滄疆娴佽绠?鈫?瀹夊叏绾︽潫 鈫?SCED 鈫?鑺傜偣鐢典环鈥濅覆璧锋潵</h3>',
                '<p style="margin:0 0 8px;">浣犲彲浠ユ妸杩欎釜椤甸潰鐞嗚В鎴愪竴涓?<b>涓夎妭鐐?DC-SCED/LMP 鏁欏娌欑洏</b>锛氬乏渚ц皟鍙傛暟锛屼腑闂寸湅娼祦锛屽彸渚у鏋滄湁闂灏辩洿鎺ラ棶鎴戙€備笅闈㈣繖娈甸粯璁ゅ唴瀹癸紝灏辨槸鎶婂綋鍓嶅満鏅噷 1~4 鐨勯€昏緫鍏堣閫忥紝鏂逛究浣犻『鐫€绠椼€?/p>',
                '<div style="margin-top:10px;"><h4 style="margin:0 0 6px;color:var(--ink);font-size:12px;font-weight:800;">1. 鍏堢湅缃戠粶杈圭晫鍜屾疆娴佹柟鍚?/h4>' + exp.border + '</div>',
                '<div style="margin-top:10px;"><h4 style="margin:0 0 6px;color:var(--ink);font-size:12px;font-weight:800;">2. 鍐嶇湅 SCED 鎬庝箞浠庢姤浠峰€奸噷閫夊嚭鍑烘竻鐐?/h4>' + exp.dispatch + '</div>',
                '<div style="margin-top:10px;"><h4 style="margin:0 0 6px;color:var(--ink);font-size:12px;font-weight:800;">3. 鏈€鍚庣湅 LMP 涓轰粈涔堜細琚垎鎴愯兘閲忎环鍜岄樆濉炰环</h4>' + exp.pricing + '</div>',
                '<div class="ai-link-box"><div style="font-weight:800;color:var(--ink);margin-bottom:6px;">鍜屸€淪CED 浼樺寲绠楁硶涓庤妭鐐圭數浠?(LMP) 鐞嗚妯″瀷瑙ｆ瀽鈥濈殑鑱斿姩</div><div>鍙充晶鐞嗚鍖洪噷鐪嬪埌鐨?<code>Min Cost</code>銆?code>PTDF</code>銆?code>LMPi = 浣?- PTDF路娓?/code>锛屽湪杩欓噷閮借兘鍜屽綋鍓嶅満鏅竴涓€瀵逛笂銆備綘闂€滀负浠€涔?B 鐐规瘮 A 鐐硅吹鈥濓紝鎴戜細鐩存帴鎷垮綋鍓嶆疆娴佸拰绾︽潫鍛婅瘔浣犳槸鍝潯绾挎妸浠锋牸椤朵笂鍘荤殑銆?/div></div>'
            ].join('');

            addAiMessage('assistant', html, true);
        }

        window.addEventListener('load', () => {
            const exp = scenarioExplanations[currentActiveScenario] || scenarioExplanations.base;
            if (exp && document.getElementById('ai_messages') && !document.getElementById('ai_messages').children.length) {
                setDefaultAiContent(currentActiveScenario);
            }
        });
    