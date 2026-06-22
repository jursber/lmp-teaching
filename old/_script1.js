
        let currentActiveScenario = "base";

        const scenarios = {
            base: {
                max_g1: 100, price_g1: 15,
                max_g2: 80, price_g2: 30,
                max_g3: 60, price_g3: 50,
                load_a: 10, load_b: 50, load_c: 40,
                limit_ab: 100, limit_bc: 100, limit_ac: 100,
                x_ab: 1.0, x_bc: 1.0, x_ac: 1.0
            },
            congestion: {
                max_g1: 100, price_g1: 15,
                max_g2: 80, price_g2: 30,
                max_g3: 60, price_g3: 50,
                load_a: 10, load_b: 80, load_c: 10,
                limit_ab: 20, limit_bc: 100, limit_ac: 100,
                x_ab: 1.0, x_bc: 1.0, x_ac: 1.0
            },
            negative: {
                max_g1: 100, price_g1: 10,
                max_g2: 80, price_g2: 150,
                max_g3: 60, price_g3: 50,
                load_a: 0, load_b: 90, load_c: 0,
                limit_ab: 20, limit_bc: 100, limit_ac: 100,
                x_ab: 0.5, x_bc: 1.0, x_ac: 1.0
            },
            surplus: {
                max_g1: 100, price_g1: 10,
                max_g2: 80, price_g2: 40,
                max_g3: 60, price_g3: 100,
                load_a: 5, load_b: 65, load_c: 30,
                limit_ab: 15, limit_bc: 50, limit_ac: 50,
                x_ab: 1.0, x_bc: 1.0, x_ac: 1.0
            }
        };

                const scenarioExplanations = {
            base: {
                badge: "1 ��Լ����������",
                border: `
                    <p><b>�ȿ�������</b>������·�޶�ܿ���100 MW �����²��ᴥ����·Լ����DC ģ��ֻ����Ѿ�ע���̯�������ߡ�</p>
                    <div class="calc-line">��ע�룺Pi = Gi - Li��������Fk = PTDF(k,A)��PA + PTDF(k,B)��PB</div>
                    <p>��ʱ PTDF ���ڹ���������������κ���·�Ƶ����ޣ�������ֻ���ں�̨���������������ı����˳��</p>
                `,
                dispatch: `
                    <p><b>�ٿ� SCED��</b>Ŀ������С���ܳɱ�����Ϊ G1 ������������㹻�����Գ����ֱ������ G1 ������������鲻����</p>
                    <div class="calc-line">GA = 100 MW��GB = 0 MW��GC = 0 MW���ܳɱ� = 15 �� 100 = 1500 Ԫ</div>
                    <p>ֻҪ���������ޣ����Ž���Ǳ��˻���������������Ǿ��õ��������ص���̬��</p>
                `,
                pricing: `
                    <p><b>��� LMP��</b>��ǰû��ӵ�£����Խڵ��۾���ͳһ�������ۡ�</p>
                    <div class="calc-line">LMPi �� [Cost(Li + 0.05) - Cost(Li)] / 0.05</div>
                    <p>��Ϊ����Ӱ�Ӽ�Ϊ 0�����ڵ�ı߼ʲɹ��ɱ���ͬ������ A��B��C �����ڵ�� LMP һ����</p>
                `
            },
            congestion: {
                badge: "2 ��·ӵ�¼۸����",
                border: `
                    <p><b>�ȿ�ƿ����</b>B �ڵ㸺������ 80 MW��AB ��·�޶�ѹ�� 20 MW���������Ǳ��˵�Դ���ܣ������Ͳ���ȥ��</p>
                    <div class="calc-line">PA ����ʱ��FAB = PTDF(AB,A)��PA + PTDF(AB,B)��PB ����ײ�� AB ����</div>
                    <p>�������ǰ���ֱͬ���ߣ����ǰ������迹�Զ����������� A �����ͻ�ͬʱ��ռ AB��AC��BC ��������</p>
                `,
                dispatch: `
                    <p><b>SCED �Ķ�����</b>���ֻ������ֵ��G1 Ӧ�þ����෢���� AB �ȿ�ס�󣬼����� G1 ��Υ��Լ��������ϵͳֻ�ܸĵ� B �㱾�ػ��� G2��</p>
                    <div class="calc-line">���ŵ����ڡ�����ƽ��Լ�� + AB �޶�Ľ���</div>
                    <p>����ǰ�ȫԼ�����õ��ȵĺ��ģ�Ŀ�����ǵͳɱ�������������·�޶��п��ˡ�</p>
                `,
                pricing: `
                    <p><b>Ϊʲô�ڵ��۷��ѣ�</b>A ��� 0.05 MW ���ɣ���Ҫ���õͼ� G1��B ��� 0.05 MW ���ɣ������ AB ����ЧӦ��������ø���ı�����Դ��</p>
                    <div class="calc-line">LMPA �� LMPB��ӵ��ʱ�ڵ��ۻ������·Ӱ�Ӽ�</div>
                    <p>��ʽ�Ͼ��� LMPi = λ - PTDF��μ����ͬ�ڵ�� AB �� PTDF ��ͬ��������������Ҳ��ͬ��</p>
                `
            },
            negative: {
                badge: "3 �ڵ㸺������",
                border: `
                    <p><b>Ϊʲô����ָ���ۣ�</b>AB �ܽ���B �㸺���أ�G2 ���Ǹ߼ۻ��顣Ϊ������ G2��ϵͳ�ᾡ���� A ��ͼ� G1 ���ͣ��������ֱ� AB Լ����ס��</p>
                    <div class="calc-line">ĳ�ڵ��������ɲ�ֻ�ı�����ƽ�⣬����ı�������·�����ֲ�</div>
                    <p>�����������������ʱ�ᡰ��æ������ƿ������ϵͳ�����˵�������¿��С�</p>
                `,
                dispatch: `
                    <p><b>SCED �Ŀ����򱻷���򿪣�</b>�������ɿ��ܻ���ӵ�£�����ϵͳ�����Ż���������ø����˵� G1 ������ָ߼� G2��</p>
                    <div class="calc-line">��������� �� ���н⼯�ϱ�� �� �ܳɱ����������½�</div>
                    <p>�ⲻ�ǲ������裬���ǡ��������� + ���õ��ȡ����Ӻ�ı߼ʽ����</p>
                `,
                pricing: `
                    <p><b>�� LMP ��ô�㣺</b>����ڵ����� 0.05 MW ������ȫ���ܳɱ��½�����ô�߼ʳɱ����Ǹ��ģ�LMPA Ҳ���ɸ�ֵ��</p>
                    <div class="calc-line">�� ��Cost = -2.5 Ԫ����L = 0.05 MW���� LMPA = -50 Ԫ/MWh</div>
                    <p>������ʽ�����������������ֵ����������ʱ���ڵ�߼ʼ۸�ͻ���� 0��</p>
                `
            },
            surplus: {
                badge: "4 �߶�����ӯ��",
                border: `
                    <p><b>��Լ��ͬʱ��Ч��</b>AB ֻ�� 15 MW��BC Ҳֻ�� 50 MW�����ɷֲ��� A��B��C ���㡣���ǵ����߿�ס�����Ƕ������湲ͬ���������</p>
                    <div class="calc-line">ÿ����·���� Fmax �� Fk(PA,PB) �� -Fmax�����Լ�������γɶ���ο�����</div>
                    <p>ͬ�� 1 MW ��ע�룬��㲻ͬ�����ܼ�ռ��ȫ��ͬ����·��Դ��</p>
                `,
                dispatch: `
                    <p><b>SCED �ڶ���߽�������͵㣺</b>G1 ����˵��������ޣ�G2 �еȣ�G3 ���ϵͳ�����̨������������������ƽ�⡢�������޺���·�޶�ͬʱ���㡣</p>
                    <div class="calc-line">���ŵ㳣���ڡ�����ƽ��Լ�� + һ���������·�޶� + ĳЩ����߽硱�Ľ���</div>
                    <p>��Ҳ������Ϊʲô����ӯ����󣺵�ఴ���Խڵ� LMP ��֧������ఴ����ע��ڵ� LMP ���㣬����·Լ���Ŵ�</p>
                `,
                pricing: `
                    <p><b>LMP �Ľ��ݲ����Զ��μ��</b>ÿ������·�����Լ���Ӱ�Ӽ۸񡣽ڵ� i �ļ۸���ֻ��������鱨��ֵ�����������ۼ�ȥ���а���·�� PTDF ��Ȩ������</p>
                    <div class="calc-line">LMPi = λ - [PTDF(AB,i)��μAB + PTDF(BC,i)��μBC + PTDF(AC,i)��μAC]</div>
                    <p>���ڵ㸺��ͬʱ���ض���ƿ��ʱ������ LMP ����ߣ������պð�æ����ƿ����LMP Ҳ���ܸ��͡�</p>
                `
            }
        };

        const sliderKeys = [
            "price_g1", "max_g1", "price_g2", "max_g2", "price_g3", "max_g3",
            "load_a", "load_b", "load_c", "limit_ab", "limit_bc", "limit_ac"
        ];

        function syncSlider(id) {
            const input = document.getElementById(id);
            const slider = document.getElementById("slider_" + id);
            if (input && slider) slider.value = input.value;
        }

        function syncInput(id) {
            const input = document.getElementById(id);
            const slider = document.getElementById("slider_" + id);
            if (input && slider) input.value = slider.value;
        }

        function loadScenario(key) {
            currentActiveScenario = key;
            const sc = scenarios[key];
            if (!sc) return;

            Object.keys(sc).forEach((field) => {
                const input = document.getElementById(field);
                if (input) input.value = sc[field];
            });

            sliderKeys.forEach((field) => {
                const slider = document.getElementById("slider_" + field);
                if (slider) slider.value = sc[field];
            });

            document.querySelectorAll(".scenario-btn").forEach((btn) => {
                btn.classList.toggle("active", btn.dataset.scenario === key);
            });

            runSCED();
            setDefaultAiContent(key);
        }

        function detectCustomParam() {
            const current = {
                limit_ab: parseFloat(document.getElementById("limit_ab").value),
                limit_bc: parseFloat(document.getElementById("limit_bc").value),
                limit_ac: parseFloat(document.getElementById("limit_ac").value),
                load_a: parseFloat(document.getElementById("load_a").value),
                load_b: parseFloat(document.getElementById("load_b").value),
                load_c: parseFloat(document.getElementById("load_c").value),
                price_g1: parseFloat(document.getElementById("price_g1").value),
                price_g2: parseFloat(document.getElementById("price_g2").value),
                price_g3: parseFloat(document.getElementById("price_g3").value)
            };

            const matched = Object.values(scenarios).some((sc) =>
                current.limit_ab === sc.limit_ab &&
                current.limit_bc === sc.limit_bc &&
                current.limit_ac === sc.limit_ac &&
                current.load_a === sc.load_a &&
                current.load_b === sc.load_b &&
                current.load_c === sc.load_c &&
                current.price_g1 === sc.price_g1 &&
                current.price_g2 === sc.price_g2 &&
                current.price_g3 === sc.price_g3
            );

            if (!matched) {
                document.querySelectorAll(".scenario-btn").forEach((btn) => btn.classList.remove("active"));
            }
        }

        function solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC) {
            const L_tot = LA + LB + LC;
            const B_AA = 1 / XAB + 1 / XAC;
            const B_BB = 1 / XAB + 1 / XBC;
            const B_AB = -1 / XAB;
            const det = B_AA * B_BB - B_AB * B_AB;

            if (Math.abs(det) < 1e-6) {
                return { error: "电网导纳矩阵奇异，请勿将电抗设置�?0�? };
            }

            const Z_AA = B_BB / det;
            const Z_BB = B_AA / det;
            const Z_AB = -B_AB / det;

            const PTDF_AB_A = (Z_AA - Z_AB) / XAB;
            const PTDF_BC_A = Z_AB / XBC;
            const PTDF_AC_A = Z_AA / XAC;

            const PTDF_AB_B = (Z_AB - Z_BB) / XAB;
            const PTDF_BC_B = Z_BB / XBC;
            const PTDF_AC_B = Z_AB / XAC;

            const C_AB = PTDF_AB_A * LA + PTDF_AB_B * LB;
            const C_BC = PTDF_BC_A * LA + PTDF_BC_B * LB;
            const C_AC = PTDF_AC_A * LA + PTDF_AC_B * LB;

            const lines = [
                { a: 1, b: 0, c: 0 },
                { a: 1, b: 0, c: GA_max },
                { a: 0, b: 1, c: 0 },
                { a: 0, b: 1, c: GB_max },
                { a: 1, b: 1, c: L_tot },
                { a: 1, b: 1, c: L_tot - GC_max },
                { a: PTDF_AB_A, b: PTDF_AB_B, c: FAB_max + C_AB },
                { a: PTDF_AB_A, b: PTDF_AB_B, c: -FAB_max + C_AB },
                { a: PTDF_BC_A, b: PTDF_BC_B, c: FBC_max + C_BC },
                { a: PTDF_BC_A, b: PTDF_BC_B, c: -FBC_max + C_BC },
                { a: PTDF_AC_A, b: PTDF_AC_B, c: FAC_max + C_AC },
                { a: PTDF_AC_A, b: PTDF_AC_B, c: -FAC_max + C_AC }
            ];

            const candidates = [];
            const eps = 1e-4;

            for (let i = 0; i < lines.length; i++) {
                for (let j = i + 1; j < lines.length; j++) {
                    const l1 = lines[i];
                    const l2 = lines[j];
                    const d = l1.a * l2.b - l1.b * l2.a;

                    if (Math.abs(d) > 1e-8) {
                        const ga = (l1.c * l2.b - l1.b * l2.c) / d;
                        const gb = (l1.a * l2.c - l1.c * l2.a) / d;
                        const gc = L_tot - ga - gb;

                        if (ga >= -eps && ga <= GA_max + eps &&
                            gb >= -eps && gb <= GB_max + eps &&
                            gc >= -eps && gc <= GC_max + eps) {

                            const f_AB = PTDF_AB_A * (ga - LA) + PTDF_AB_B * (gb - LB);
                            const f_BC = PTDF_BC_A * (ga - LA) + PTDF_BC_B * (gb - LB);
                            const f_AC = PTDF_AC_A * (ga - LA) + PTDF_AC_B * (gb - LB);

                            if (f_AB >= -FAB_max - eps && f_AB <= FAB_max + eps &&
                                f_BC >= -FBC_max - eps && f_BC <= FBC_max + eps &&
                                f_AC >= -FAC_max - eps && f_AC <= FAC_max + eps) {

                                const clean_ga = Math.max(0, Math.min(GA_max, ga));
                                const clean_gb = Math.max(0, Math.min(GB_max, gb));
                                const clean_gc = Math.max(0, Math.min(GC_max, gc));

                                candidates.push({
                                    GA: clean_ga,
                                    GB: clean_gb,
                                    GC: clean_gc,
                                    cost: priceA * clean_ga + priceB * clean_gb + priceC * clean_gc
                                });
                            }
                        }
                    }
                }
            }

            if (candidates.length === 0) {
                return { error: "电网过载或装机容量不足，SCED 安全校核无解�? };
            }

            candidates.sort((x, y) => x.cost - y.cost);
            return candidates[0];
        }

        function calculateLMPs(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC) {
            const baseSol = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            if (baseSol.error) return baseSol;

            let lmpA;
            let lmpB;
            let lmpC;
            const delta = 0.05;

            let solA = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA + delta, LB, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            if (!solA.error) {
                lmpA = (solA.cost - baseSol.cost) / delta;
            } else {
                const solANeg = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA - delta, LB, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
                lmpA = !solANeg.error ? (baseSol.cost - solANeg.cost) / delta : priceA;
            }

            let solB = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB + delta, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            if (!solB.error) {
                lmpB = (solB.cost - baseSol.cost) / delta;
            } else {
                const solBNeg = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB - delta, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
                lmpB = !solBNeg.error ? (baseSol.cost - solBNeg.cost) / delta : priceB;
            }

            let solC = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB, LC + delta, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            if (!solC.error) {
                lmpC = (solC.cost - baseSol.cost) / delta;
            } else {
                const solCNeg = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB, LC - delta, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
                lmpC = !solCNeg.error ? (baseSol.cost - solCNeg.cost) / delta : priceC;
            }

            return { base: baseSol, lmpA, lmpB, lmpC };
        }

        function runSCED() {
            detectCustomParam();

            const priceA = parseFloat(document.getElementById("price_g1").value);
            const GA_max = parseFloat(document.getElementById("max_g1").value);
            const priceB = parseFloat(document.getElementById("price_g2").value);
            const GB_max = parseFloat(document.getElementById("max_g2").value);
            const priceC = parseFloat(document.getElementById("price_g3").value);
            const GC_max = parseFloat(document.getElementById("max_g3").value);

            const LA = parseFloat(document.getElementById("load_a").value);
            const LB = parseFloat(document.getElementById("load_b").value);
            const LC = parseFloat(document.getElementById("load_c").value);

            const FAB_max = parseFloat(document.getElementById("limit_ab").value);
            const FBC_max = parseFloat(document.getElementById("limit_bc").value);
            const FAC_max = parseFloat(document.getElementById("limit_ac").value);

            const XAB = parseFloat(document.getElementById("x_ab").value);
            const XBC = parseFloat(document.getElementById("x_bc").value);
            const XAC = parseFloat(document.getElementById("x_ac").value);

            const result = calculateLMPs(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            const errorOverlay = document.getElementById("error_overlay");

            if (result.error) {
                errorOverlay.classList.remove("hidden");
                document.getElementById("error_title").innerText = "SCED 安全出清失败";
                document.getElementById("error_desc").innerText = result.error + " 请尝试放宽输电断面或减少节点负荷�?;
                return;
            }
            errorOverlay.classList.add("hidden");

            const sol = result.base;
            const lmpA = result.lmpA;
            const lmpB = result.lmpB;
            const lmpC = result.lmpC;

            const B_AA = 1 / XAB + 1 / XAC;
            const B_BB = 1 / XAB + 1 / XBC;
            const B_AB = -1 / XAB;
            const det = B_AA * B_BB - B_AB * B_AB;

            const Z_AA = B_BB / det;
            const Z_BB = B_AA / det;
            const Z_AB = -B_AB / det;

            const PTDF_AB_A = (Z_AA - Z_AB) / XAB;
            const PTDF_BC_A = Z_AB / XBC;
            const PTDF_AC_A = Z_AA / XAC;

            const PTDF_AB_B = (Z_AB - Z_BB) / XAB;
            const PTDF_BC_B = Z_BB / XBC;
            const PTDF_AC_B = Z_AB / XAC;

            const flow_ab = PTDF_AB_A * (sol.GA - LA) + PTDF_AB_B * (sol.GB - LB);
            const flow_bc = PTDF_BC_A * (sol.GA - LA) + PTDF_BC_B * (sol.GB - LB);
            const flow_ac = PTDF_AC_A * (sol.GA - LA) + PTDF_AC_B * (sol.GB - LB);
            const netA = sol.GA - LA;
            const netB = sol.GB - LB;
            const netC = sol.GC - LC;

            document.getElementById("lmp_lbl_a").textContent = lmpA.toFixed(1) + "�?;
            document.getElementById("lmp_lbl_b").textContent = lmpB.toFixed(1) + "�?;
            document.getElementById("lmp_lbl_c").textContent = lmpC.toFixed(1) + "�?;

            document.getElementById("node_a_gen").textContent = `G:${sol.GA.toFixed(0)}M`;
            document.getElementById("node_b_gen").textContent = `G:${sol.GB.toFixed(0)}M`;
            document.getElementById("node_c_gen").textContent = `G:${sol.GC.toFixed(0)}M`;

            document.getElementById("node_a_load").textContent = `L:${LA.toFixed(0)}M`;
            document.getElementById("node_b_load").textContent = `L:${LB.toFixed(0)}M`;
            document.getElementById("node_c_load").textContent = `L:${LC.toFixed(0)}M`;

            const genRevenue = sol.GA * priceA + sol.GB * priceB + sol.GC * priceC;
            document.getElementById("total_cost").textContent = genRevenue.toFixed(2) + " �?;

            const totalLoadPaid = LA * lmpA + LB * lmpB + LC * lmpC;
            const totalGenPaid = sol.GA * lmpA + sol.GB * lmpB + sol.GC * lmpC;
            const rent = Math.max(0, totalLoadPaid - totalGenPaid);
            document.getElementById("congestion_rent").textContent = rent.toFixed(2) + " �?;

            const basePrice = lmpC;
            document.getElementById("lmp_a_val").textContent = lmpA.toFixed(2) + " �?;
            document.getElementById("lmp_a_comp").textContent = `电能:${basePrice.toFixed(1)} | 阻塞:${(lmpA - basePrice).toFixed(1)}`;
            document.getElementById("lmp_b_val").textContent = lmpB.toFixed(2) + " �?;
            document.getElementById("lmp_b_comp").textContent = `电能:${basePrice.toFixed(1)} | 阻塞:${(lmpB - basePrice).toFixed(1)}`;
            document.getElementById("lmp_c_val").textContent = lmpC.toFixed(2) + " �?;
            document.getElementById("lmp_c_comp").textContent = `电能:${basePrice.toFixed(1)} | 阻塞:${(lmpC - basePrice).toFixed(1)}`;

            document.getElementById("tbl_gen_g1").textContent = sol.GA.toFixed(1);
            document.getElementById("tbl_rev_g1").textContent = lmpA.toFixed(1) + " / " + (sol.GA * lmpA).toFixed(1);
            document.getElementById("tbl_gen_g2").textContent = sol.GB.toFixed(1);
            document.getElementById("tbl_rev_g2").textContent = lmpB.toFixed(1) + " / " + (sol.GB * lmpB).toFixed(1);
            document.getElementById("tbl_gen_g3").textContent = sol.GC.toFixed(1);
            document.getElementById("tbl_rev_g3").textContent = lmpC.toFixed(1) + " / " + (sol.GC * lmpC).toFixed(1);

            document.getElementById("ptdf_val_ab_a").textContent = `PTDF(AB,A) = ${PTDF_AB_A >= 0 ? "+" : ""}${PTDF_AB_A.toFixed(2)}`;
            document.getElementById("ptdf_val_bc_a").textContent = `PTDF(BC,A) = ${PTDF_BC_A >= 0 ? "+" : ""}${PTDF_BC_A.toFixed(2)}`;
            document.getElementById("ptdf_val_ac_a").textContent = `PTDF(AC,A) = ${PTDF_AC_A >= 0 ? "+" : ""}${PTDF_AC_A.toFixed(2)}`;
            document.getElementById("ptdf_val_ab_b").textContent = `PTDF(AB,B) = ${PTDF_AB_B >= 0 ? "+" : ""}${PTDF_AB_B.toFixed(2)}`;
            document.getElementById("ptdf_val_bc_b").textContent = `PTDF(BC,B) = ${PTDF_BC_B >= 0 ? "+" : ""}${PTDF_BC_B.toFixed(2)}`;
            document.getElementById("ptdf_val_ac_b").textContent = `PTDF(AC,B) = ${PTDF_AC_B >= 0 ? "+" : ""}${PTDF_AC_B.toFixed(2)}`;

            updateFlowLine("flow_ab_path", "flow_txt_ab", flow_ab, FAB_max, 440, 76, 760, 276);
            updateFlowLine("flow_bc_path", "flow_txt_bc", flow_bc, FBC_max, 760, 276, 120, 276);
            updateFlowLine("flow_ca_path", "flow_txt_ac", -flow_ac, FAC_max, 120, 276, 440, 76);

            const isCongested = Math.abs(flow_ab) >= FAB_max - 0.1 || Math.abs(flow_bc) >= FBC_max - 0.1 || Math.abs(flow_ac) >= FAC_max - 0.1;
            const delta = 0.05;
            const solAPlus = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA + delta, LB, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            const solBPlus = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB + delta, LC, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            const solCPlus = solveSCED(GA_max, GB_max, GC_max, priceA, priceB, priceC, LA, LB, LC + delta, FAB_max, FBC_max, FAC_max, XAB, XBC, XAC);
            const fmt = (n, digits = 2) => Number.isFinite(n) ? n.toFixed(digits) : "--";
            const pct = (flow, limit) => `${fmt(Math.abs(flow) / Math.max(Math.abs(limit), 0.001) * 100, 0)}%`;
            const bindLabel = (name, flow, limit) => {
                const ratio = Math.abs(flow) / Math.max(Math.abs(limit), 0.001);
                const dir = flow >= 0 ? "正向" : "反向";
                const status = ratio >= 0.98 ? "绑定" : ratio >= 0.75 ? "接近绑定" : "未绑�?;
                return `${name}: ${fmt(flow, 2)} / ±${fmt(limit, 0)} MW�?{dir}�?{pct(flow, limit)}�?{status}`;
            };
            const perturbText = (node, plusSol, lmp) => {
                if (plusSol.error) return `${node}: +${delta} MW 后无可行解，采用反向扰动估计 LMP = ${fmt(lmp, 2)} �?MWh`;
                return `${node}: [${fmt(plusSol.cost, 2)} - ${fmt(sol.cost, 2)}] / ${delta} = ${fmt(lmp, 2)} �?MWh`;
            };

            document.getElementById("theory_dispatch_snapshot").innerHTML = `
                <p>负荷合计 L = ${fmt(LA + LB + LC, 1)} MW；最优出�?GA=${fmt(sol.GA, 1)}、GB=${fmt(sol.GB, 1)}、GC=${fmt(sol.GC, 1)} MW�?/p>
                <div class="calc-line">节点净注入：PA=GA-LA=${fmt(netA, 1)}，PB=GB-LB=${fmt(netB, 1)}，PC=GC-LC=${fmt(netC, 1)} MW；三者相加为 ${fmt(netA + netB + netC, 4)}�?/div>
                <p>SCED 的目标成本为 ${fmt(sol.cost, 2)} 元。右侧机组结算表显示的是按节�?LMP 结算后的市场收益，不等同于报价成本�?/p>
            `;

            document.getElementById("theory_flow_equations").innerHTML = `
                <div class="calc-line">FAB = ${fmt(PTDF_AB_A, 3)}×PA + ${fmt(PTDF_AB_B, 3)}×PB = ${fmt(flow_ab, 2)} MW</div>
                <div class="calc-line">FBC = ${fmt(PTDF_BC_A, 3)}×PA + ${fmt(PTDF_BC_B, 3)}×PB = ${fmt(flow_bc, 2)} MW</div>
                <div class="calc-line">FAC = ${fmt(PTDF_AC_A, 3)}×PA + ${fmt(PTDF_AC_B, 3)}×PB = ${fmt(flow_ac, 2)} MW</div>
                <p>因为 C 是平衡参考节点，PC 不单独进入上式；它由 PA + PB + PC = 0 自动确定�?/p>
            `;

            document.getElementById("theory_binding_status").innerHTML = `
                <div class="calc-line">${bindLabel("AB", flow_ab, FAB_max)}</div>
                <div class="calc-line">${bindLabel("BC", flow_bc, FBC_max)}</div>
                <div class="calc-line">${bindLabel("AC", flow_ac, FAC_max)}</div>
                <p>绑定线路对应非零影子价格 μ。节点之�?LMP 是否分裂，关键看“绑定约束的 μ”与“各节点 PTDF”相乘后的修正项是否不同�?/p>
            `;

            document.getElementById("theory_lmp_derivation").innerHTML = `
                ${perturbText("A �?, solAPlus, lmpA)}<br>
                ${perturbText("B �?, solBPlus, lmpB)}<br>
                ${perturbText("C �?, solCPlus, lmpC)}<br>
                <span class="text-note">这三行就是节点电价的数值定义：在指定节点多服务一点负荷，SCED 最优采购成本的边际变化�?/span>
            `;

            let explanation = "";

            if (!isCongested) {
                let marginalG = "G3";
                if (sol.GA > 0 && sol.GA < GA_max) marginalG = "G1";
                else if (sol.GB > 0 && sol.GB < GB_max) marginalG = "G2";

                explanation = `<b>全网无阻塞：</b>当前没有线路触及安全极限，边际机组为 <b>${marginalG}</b>。无网损模型下各节点 LMP 一致，均为 <b>${lmpC.toFixed(2)} �?MWh</b>。`;
            } else {
                const activeLimits = [];
                if (Math.abs(flow_ab) >= FAB_max - 0.1) activeLimits.push(`AB ${flow_ab > 0 ? "正向" : "反向"}`);
                if (Math.abs(flow_bc) >= FBC_max - 0.1) activeLimits.push(`BC ${flow_bc > 0 ? "正向" : "反向"}`);
                if (Math.abs(flow_ac) >= FAC_max - 0.1) activeLimits.push(`AC ${flow_ac > 0 ? "正向" : "反向"}`);

                explanation = `<b>阻塞约束生效�?/b>${activeLimits.join("�?)} 已触及限额。低价机组外送被卡住，系统被迫调用高价本地机组。用电侧支付 <b>${totalLoadPaid.toFixed(1)} �?/b>，发电侧结算 <b>${totalGenPaid.toFixed(1)} �?/b>，阻塞盈余为 <b>${rent.toFixed(1)} �?/b>。`;

                let negNode = null;
                let negVal = 0;
                if (lmpA < -0.01) { negNode = "A"; negVal = lmpA; }
                else if (lmpB < -0.01) { negNode = "B"; negVal = lmpB; }
                else if (lmpC < -0.01) { negNode = "C"; negVal = lmpC; }

                if (negNode) {
                    explanation += `<br><br><b style="color: var(--red)">负电价信号：</b>节点 ${negNode} 的边际价格为 <b>${negVal.toFixed(2)} �?MWh</b>。在当前拓扑下，该节点新增负荷能缓解关键断面，因此降低全网边际采购成本。`;
                }
            }

            document.getElementById("realtime_explanation").innerHTML = explanation;
        }

        function updateFlowLine(lineId, txtId, flowValue, limit, x1, y1, x2, y2) {
            const line = document.getElementById(lineId);
            const txt = document.getElementById(txtId);
            const safeLimit = Math.max(0.001, Math.abs(limit));
            const ratio = Math.min(1.0, Math.abs(flowValue) / safeLimit);

            txt.textContent = `${lineId.replace("_path", "").replace("flow_", "").toUpperCase()}: ${Math.abs(flowValue).toFixed(1)} / ${limit}M`;

            if (flowValue < -0.1) {
                line.setAttribute("x1", x2);
                line.setAttribute("y1", y2);
                line.setAttribute("x2", x1);
                line.setAttribute("y2", y1);
            } else {
                line.setAttribute("x1", x1);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2);
                line.setAttribute("y2", y2);
            }

            if (Math.abs(flowValue) < 1.0) {
                line.style.animationPlayState = "paused";
                line.setAttribute("stroke", "#3b4958");
                line.setAttribute("stroke-width", "3");
                txt.style.fill = "#7d8b99";
                return;
            }

            line.style.animationPlayState = "running";
            line.style.animationDuration = `${Math.max(0.45, 3.0 - ratio * 2.3)}s`;

            if (ratio >= 0.98) {
                line.setAttribute("stroke", "#ef4b4b");
                line.setAttribute("stroke-width", "5");
                txt.style.fill = "#ff7a7a";
            } else if (ratio >= 0.75) {
                line.setAttribute("stroke", "#f2a51a");
                line.setAttribute("stroke-width", "4.5");
                txt.style.fill = "#f2a51a";
            } else {
                line.setAttribute("stroke", "#00d896");
                line.setAttribute("stroke-width", "4");
                txt.style.fill = "#9aa8b6";
            }
        }

        /* ===== AI 教学上下文提�?===== */

        function getCurrentInputs() {
            return {
                generators: [
                    { name: "G1", node: "A", price: parseFloat(document.getElementById("price_g1").value), max: parseFloat(document.getElementById("max_g1").value) },
                    { name: "G2", node: "B", price: parseFloat(document.getElementById("price_g2").value), max: parseFloat(document.getElementById("max_g2").value) },
                    { name: "G3", node: "C", price: parseFloat(document.getElementById("price_g3").value), max: parseFloat(document.getElementById("max_g3").value) }
                ],
                loads: {
                    A: parseFloat(document.getElementById("load_a").value),
                    B: parseFloat(document.getElementById("load_b").value),
                    C: parseFloat(document.getElementById("load_c").value)
                },
                lines: [
                    { name: "AB", limit: parseFloat(document.getElementById("limit_ab").value), reactance: parseFloat(document.getElementById("x_ab").value) },
                    { name: "BC", limit: parseFloat(document.getElementById("limit_bc").value), reactance: parseFloat(document.getElementById("x_bc").value) },
                    { name: "AC", limit: parseFloat(document.getElementById("limit_ac").value), reactance: parseFloat(document.getElementById("x_ac").value) }
                ],
                scenario: currentActiveScenario,
                isCustom: !scenarios[currentActiveScenario]
            };
        }

        function solveCurrentState(inputs) {
            const g = inputs.generators;
            const l = inputs.loads;
            const ln = inputs.lines;

            const lmpResult = calculateLMPs(
                g[0].max, g[1].max, g[2].max,
                g[0].price, g[1].price, g[2].price,
                l.A, l.B, l.C,
                ln[0].limit, ln[1].limit, ln[2].limit,
                ln[0].reactance, ln[1].reactance, ln[2].reactance
            );

            if (lmpResult.error) return { error: lmpResult.error };

            const sol = lmpResult.base;
            const XAB = ln[0].reactance, XBC = ln[1].reactance, XAC = ln[2].reactance;

            const B_AA = 1 / XAB + 1 / XAC;
            const B_BB = 1 / XAB + 1 / XBC;
            const B_AB = -1 / XAB;
            const det = B_AA * B_BB - B_AB * B_AB;
            const Z_AA = B_BB / det, Z_BB = B_AA / det, Z_AB = -B_AB / det;

            const ptdf = {
                AB_A: (Z_AA - Z_AB) / XAB, BC_A: Z_AB / XBC, AC_A: Z_AA / XAC,
                AB_B: (Z_AB - Z_BB) / XAB, BC_B: Z_BB / XBC, AC_B: Z_AB / XAC
            };

            const netA = sol.GA - l.A, netB = sol.GB - l.B, netC = sol.GC - l.C;
            const flowAB = ptdf.AB_A * netA + ptdf.AB_B * netB;
            const flowBC = ptdf.BC_A * netA + ptdf.BC_B * netB;
            const flowAC = ptdf.AC_A * netA + ptdf.AC_B * netB;

            const delta = 0.05;
            const solA = solveSCED(g[0].max, g[1].max, g[2].max, g[0].price, g[1].price, g[2].price, l.A + delta, l.B, l.C, ln[0].limit, ln[1].limit, ln[2].limit, XAB, XBC, XAC);
            const solB = solveSCED(g[0].max, g[1].max, g[2].max, g[0].price, g[1].price, g[2].price, l.A, l.B + delta, l.C, ln[0].limit, ln[1].limit, ln[2].limit, XAB, XBC, XAC);
            const solC = solveSCED(g[0].max, g[1].max, g[2].max, g[0].price, g[1].price, g[2].price, l.A, l.B, l.C + delta, ln[0].limit, ln[1].limit, ln[2].limit, XAB, XBC, XAC);

            const totalLoadPaid = l.A * lmpResult.lmpA + l.B * lmpResult.lmpB + l.C * lmpResult.lmpC;
            const totalGenPaid = sol.GA * lmpResult.lmpA + sol.GB * lmpResult.lmpB + sol.GC * lmpResult.lmpC;
            const congestionRent = Math.max(0, totalLoadPaid - totalGenPaid);

            // 判定边际机组
            let marginalGenerator = null;
            if (sol.GA > 0 && sol.GA < g[0].max) marginalGenerator = "G1";
            else if (sol.GB > 0 && sol.GB < g[1].max) marginalGenerator = "G2";
            else if (sol.GC > 0 && sol.GC < g[2].max) marginalGenerator = "G3";
            else {
                // 所有机组要么满发要么停机，取最后调用的低价机组
                if (sol.GA > 0) marginalGenerator = "G1";
                else if (sol.GB > 0) marginalGenerator = "G2";
                else marginalGenerator = "G3";
            }

            const bindAB = Math.abs(flowAB) >= ln[0].limit - 0.1;
            const bindBC = Math.abs(flowBC) >= ln[1].limit - 0.1;
            const bindAC = Math.abs(flowAC) >= ln[2].limit - 0.1;

            return {
                solution: { GA: sol.GA, GB: sol.GB, GC: sol.GC, cost: sol.cost },
                lmp: { A: lmpResult.lmpA, B: lmpResult.lmpB, C: lmpResult.lmpC },
                flows: { AB: flowAB, BC: flowBC, AC: flowAC },
                netInjections: { A: netA, B: netB, C: netC },
                ptdf,
                bindingConstraints: [
                    bindAB && { name: "AB", flow: flowAB, limit: ln[0].limit },
                    bindBC && { name: "BC", flow: flowBC, limit: ln[1].limit },
                    bindAC && { name: "AC", flow: flowAC, limit: ln[2].limit }
                ].filter(Boolean),
                totalLoadPaid,
                totalGenPaid,
                congestionRent,
                marginalGenerator,
                energyComponent: lmpResult.lmpC,
                congestionComponents: {
                    A: lmpResult.lmpA - lmpResult.lmpC,
                    B: lmpResult.lmpB - lmpResult.lmpC,
                    C: 0
                },
                perturbation: {
                    delta,
                    costBase: sol.cost,
                    costA_plus: solA.error ? null : solA.cost,
                    costB_plus: solB.error ? null : solB.cost,
                    costC_plus: solC.error ? null : solC.cost
                }
            };
        }

        function buildTeachingContext() {
            const inputs = getCurrentInputs();
            const state = solveCurrentState(inputs);
            if (state.error) return { error: state.error, inputs };

            const exp = scenarioExplanations[currentActiveScenario];

            return {
                scenario: currentActiveScenario,
                isCustom: inputs.isCustom,
                inputs,
                solution: state.solution,
                lmp: state.lmp,
                flows: state.flows,
                netInjections: state.netInjections,
                ptdf: state.ptdf,
                bindingConstraints: state.bindingConstraints,
                totalLoadPaid: state.totalLoadPaid,
                totalGenPaid: state.totalGenPaid,
                congestionRent: state.congestionRent,
                marginalGenerator: state.marginalGenerator,
                energyComponent: state.energyComponent,
                congestionComponents: state.congestionComponents,
                perturbation: state.perturbation,
                scenarioExplanation: exp ? { badge: exp.badge, border: exp.border, dispatch: exp.dispatch, pricing: exp.pricing } : null,
                scenarioNames: { base: "无约束出�?, congestion: "线路拥堵", negative: "负电�?, surplus: "阻塞盈余" }
            };
        }

        /* ===== AI 助教交互逻辑 ===== */

        const AI_MAX_HISTORY = 10;
        let aiChatHistory = [];
        let aiAbortController = null;

        function loadAiSettings() {
            const stored = sessionStorage.getItem("ai_teaching_settings") || localStorage.getItem("ai_teaching_settings");
            if (stored) {
                try {
                    const s = JSON.parse(stored);
                    if (s.baseUrl) document.getElementById("ai_base_url").value = s.baseUrl;
                    if (s.model) document.getElementById("ai_model").value = s.model;
                    if (s.temp !== undefined) document.getElementById("ai_temp").value = s.temp;
                    if (s.rememberKey) document.getElementById("ai_remember_key").checked = true;
                } catch (e) { /* ignore */ }
            }
            const key = sessionStorage.getItem("ai_teaching_apikey") || localStorage.getItem("ai_teaching_apikey");
            if (key) {
                document.getElementById("ai_api_key").value = key;
            }
            updateAiStatus();
        }

        function saveAiSettings() {
            const baseUrl = document.getElementById("ai_base_url").value.trim();
            const model = document.getElementById("ai_model").value.trim();
            const temp = document.getElementById("ai_temp").value;

            const remember = document.getElementById("ai_remember_key").checked;
            const key = document.getElementById("ai_api_key").value.trim();
            const settingsPayload = JSON.stringify({ baseUrl, model, temp, rememberKey: remember });
            sessionStorage.setItem("ai_teaching_settings", settingsPayload);
            localStorage.setItem("ai_teaching_settings", settingsPayload);

            if (remember && key) {
                localStorage.setItem("ai_teaching_apikey", key);
                sessionStorage.removeItem("ai_teaching_apikey");
            } else {
                sessionStorage.setItem("ai_teaching_apikey", key);
                localStorage.removeItem("ai_teaching_apikey");
            }
            updateAiStatus();
        }

        function updateAiStatus() {
            const key = document.getElementById("ai_api_key").value.trim();
            const url = document.getElementById("ai_base_url").value.trim();
            const dot = document.getElementById("ai_status_dot");
            const text = document.getElementById("ai_status_text");
            if (key && url) {
                dot.className = "dot ok";
                text.textContent = "已配�?· " + (document.getElementById("ai_model").value.trim() || "deepseek-chat");
            } else {
                dot.className = "dot";
                text.textContent = "未配�?API �?请在 �?设置中填�?Base URL �?API Key";
            }
        }

        function toggleAiSettings() {
            const s = document.getElementById("ai_settings");
            s.classList.toggle("visible");
        }

        function clearAiConfig() {
            localStorage.removeItem("ai_teaching_settings");
            localStorage.removeItem("ai_teaching_apikey");
            sessionStorage.removeItem("ai_teaching_settings");
            sessionStorage.removeItem("ai_teaching_apikey");
            document.getElementById("ai_base_url").value = "";
            document.getElementById("ai_api_key").value = "";
            document.getElementById("ai_model").value = "";
            document.getElementById("ai_temp").value = "0.2";
            document.getElementById("ai_remember_key").checked = false;
            updateAiStatus();
            addAiMessage("system", "配置已清除。API Key 和设置已从浏览器中移除�?);
        }

        function addAiMessage(role, content, isHtml) {
            const box = document.getElementById("ai_messages");
            const div = document.createElement("div");
            div.className = "ai-msg " + role;
            if (role === "assistant") {
                const rendered = isHtml ? content : renderMarkdown(content);
                div.innerHTML = rendered +
                    '<div style="font-size:10px;color:#4a5c6a;margin-top:6px;border-top:1px solid rgba(255,255,255,0.04);padding-top:4px;">📌 回答基于当前页面计算上下�?· ' +
                    new Date().toLocaleTimeString("zh-CN") + '</div>';
            } else {
                div.textContent = content;
            }
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
            return div;
        }

        function showAiLoading() {
            const box = document.getElementById("ai_messages");
            const div = document.createElement("div");
            div.className = "ai-loading";
            div.id = "ai_loading_indicator";
            div.innerHTML = "<span></span><span></span><span></span>";
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
        }

        function hideAiLoading() {
            const el = document.getElementById("ai_loading_indicator");
            if (el) el.remove();
        }

        function askQuick(btn) {
            const q = btn.textContent;
            document.getElementById("ai_input").value = q;
            sendAiMessage();
        }

        async function sendAiMessage() {
            const input = document.getElementById("ai_input");
            const question = input.value.trim();
            if (!question) return;

            const baseUrl = document.getElementById("ai_base_url").value.trim();
            const apiKey = document.getElementById("ai_api_key").value.trim();
            const model = document.getElementById("ai_model").value.trim() || "deepseek-chat";
            const temp = parseFloat(document.getElementById("ai_temp").value) || 0.2;

            if (!baseUrl || !apiKey) {
                addAiMessage("error", "请先�?�?设置中配�?Base URL �?API Key�?);
                return;
            }

            saveAiSettings();

            addAiMessage("user", question);
            input.value = "";
            document.getElementById("ai_send_btn").disabled = true;
            showAiLoading();

            // 构建上下�?            const ctx = buildTeachingContext();

            // 构建消息
            const messages = [
                { role: "system", content: buildSystemPrompt() },
                { role: "system", content: "以下是当前页面的计算状态上下文（JSON）：\n```json\n" + JSON.stringify(ctx, null, 2) + "\n```" },
                ...aiChatHistory.slice(-AI_MAX_HISTORY),
                { role: "user", content: question }
            ];

            try {
                aiAbortController = new AbortController();
                const resp = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ baseUrl, apiKey, model, messages, temperature: temp }),
                    signal: aiAbortController.signal
                });

                hideAiLoading();

                if (!resp.ok) {
                    const errData = await resp.json().catch(() => ({}));
                    addAiMessage("error", "请求失败�? + (errData.error || resp.statusText));
                    return;
                }

                const data = await resp.json();
                const answer = data.choices?.[0]?.message?.content || "（模型未返回内容�?;

                addAiMessage("assistant", answer);

                aiChatHistory.push({ role: "user", content: question });
                aiChatHistory.push({ role: "assistant", content: answer });
                if (aiChatHistory.length > AI_MAX_HISTORY * 2) {
                    aiChatHistory = aiChatHistory.slice(-AI_MAX_HISTORY * 2);
                }
            } catch (e) {
                hideAiLoading();
                if (e.name === "AbortError") {
                    addAiMessage("system", "请求已取消�?);
                } else {
                    addAiMessage("error", "网络错误�? + e.message);
                }
            } finally {
                aiAbortController = null;
                document.getElementById("ai_send_btn").disabled = false;
            }
        }

        function buildSystemPrompt() {
            return `你是电力市场 SCED/LMP 教学助教。你的所有回答必须基于系统提供的 teachingContext（当前页面计算状态的结构化快照）�?
【核心规则�?1. 全程中文回答。数值使用阿拉伯数字�?2. 不得编造、捏造、推�?teachingContext 中不存在的任何数值、参数、机组、节点或线路�?3. 涉及成本、潮流、PTDF、LMP、出力、负荷时，必须直接引�?teachingContext 中的字段值，并标明来源，�?根据上下�?solution.cost = 1500 �?�?4. 若用户问"怎么�?�?为什�?，严格按以下四段式回答：
   (1) 模型公式 �?(2) 当前参数代入 �?(3) 计算过程与结�?�?(4) 物理/市场含义
5. �?teachingContext 中没有用户问的某个字段或数据，必须先声明"当前上下文未包含该信�?，再给出概念性解释。不得假装有数据�?6. 对不确定的内容明确说明不确定，绝不给出看似精确但无来源的数字�?
【未建模内容处理�?当前系统是一个三节点 DC-SCED/LMP 演示器。以下能力尚未建模：
- 机组启停（UC）、最小开停机时间、启停成�?- 爬坡约束（ramp rate�?- 备用需求与辅助服务
- 网损（loss）�?当前 DC 模型无网�?- AC 潮流、无功功率、电压约�?- 多时段优化、日�?实时市场
当用户问到上述内容时，必须先明确�?当前演示器暂未包含该约束"，再解释如果未来加入该约束，模型应如何扩展（例如引入二进制变量、增加约束行等）�?
【回答格式�?- 概念解释：先给定义，再用当前场景的具体数值举例�?- 数值推导：公式 �?代入 teachingContext 中的参数 �?计算结果 �?解释含义�?- 对比分析：可引用四个预设场景（无约束、阻塞、负电价、阻塞盈余）的差异�?- 超出范围：声明未建模 �?概念解释 �?扩展方向。`;
        }

        function renderMarkdown(text) {
            const codeBlocks = [];
            let html = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            // 提取 fenced code blocks
            html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
                const token = `__CODE_BLOCK_${codeBlocks.length}__`;
                codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
                return token;
            });

            // 提取 inline code（防粗体/列表规则误伤�?            html = html.replace(/`([^`]+)`/g, (_, code) => {
                const token = `__CODE_BLOCK_${codeBlocks.length}__`;
                codeBlocks.push(`<code>${code}</code>`);
                return token;
            });

            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/(^|\n)[-•]\s+(.+)/g, (m, p, item) => `${p}<div style="padding-left:1em;text-indent:-1em;">�?${item}</div>`);
            html = html.replace(/(^|\n)(\d+)\.\s+(.+)/g, (m, p, num, item) => `${p}<div style="padding-left:1.5em;text-indent:-1.5em;">${num}. ${item}</div>`);
            html = html.replace(/\n/g, "<br>");

            // 还原所有代码块
            codeBlocks.forEach((block, i) => {
                html = html.replace(`__CODE_BLOCK_${i}__`, block);
            });

            return html;
        }

        // 设置输入监听
        document.addEventListener("DOMContentLoaded", () => {
            ["ai_base_url", "ai_api_key", "ai_model", "ai_temp"].forEach(id => {
                document.getElementById(id).addEventListener("change", updateAiStatus);
            });
        });

        window.addEventListener("load", () => {
            loadScenario("base");
            loadAiSettings();
        });
    