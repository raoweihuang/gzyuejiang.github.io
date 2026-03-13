// 叉车价格数据（源自原表格）
const forkliftData = [
    { brand: "明宇重工", type: "燃油叉车", model: "CPC30", price: 45000, remark: "标配" },
    { brand: "明宇重工", type: "燃油叉车", model: "CPC35", price: 47000, remark: "标配" },
    { brand: "明宇重工", type: "燃油叉车", model: "CPC38", price: 49500, remark: "标配" },
    { brand: "明宇重工", type: "锂电叉车", model: "B20", price: 55000, remark: "标配" },
    { brand: "明宇重工", type: "锂电叉车", model: "B25", price: 63000, remark: "标配" },
    { brand: "明宇重工", type: "锂电叉车", model: "B30", price: 74500, remark: "标配" },
    { brand: "明宇重工", type: "锂电叉车", model: "B35", price: 76800, remark: "标配" },
    { brand: "明宇重工", type: "锂电叉车", model: "B40", price: 93500, remark: "标配" },
    { brand: "明宇重工", type: "锂电叉车", model: "B50", price: 162000, remark: "标配153.6V" },
    { brand: "明宇重工", type: "锂电叉车", model: "B50", price: 220500, remark: "高压版544V" }
];

let currentForklift = null;
const searchBtn = document.getElementById("searchBtn");
const modelInput = document.getElementById("modelInput");
const resultArea = document.getElementById("resultArea");

searchBtn.addEventListener("click", searchPrice);
modelInput.addEventListener("keydown", (e) => e.key === "Enter" && searchPrice());

function searchPrice() {
    const inputModel = modelInput.value.trim().toUpperCase();
    if (!inputModel) {
        resultArea.innerHTML = '<div class="no-result">请输入有效的叉车型号</div>';
        currentForklift = null;
        return;
    }

    const matches = forkliftData.filter(item => item.model.toUpperCase() === inputModel);
    if (matches.length === 0) {
        resultArea.innerHTML = `<div class="no-result">未查询到型号「${inputModel}」</div>`;
        currentForklift = null;
    } else {
        let resultHtml = "";
        matches.forEach((item, index) => {
            if (index === 0) currentForklift = item;

            const mastConfig = `
                <div class="config-group">
                    <label>门架类型</label>
                    <select id="mast-${index}">
                        <option value="0">标配（无加价）</option>
                        <option value="2000">2级4米门架（+2000元）</option>
                        <option value="3000">带中缸（+3000元）</option>
                        <option value="6000">3级4.5米全自由门架（+6000元）</option>
                        <option value="9000">3级6米全自由门架（+9000元）</option>
                    </select>
                </div>
            `;

            const attachmentConfig = `
                <div class="config-group">
                    <label>属具选择类型</label>
                    <select id="attachment-${index}" onchange="togglePipeValve(${index})">
                        <option value="0">无属具（无加价）</option>
                        <option value="2500">侧移（+2500元）</option>
                        <option value="3000">倾翻装置（+3000元）</option>
                    </select>
                </div>

                <div class="config-group" id="pipeValveGroup-${index}">
                    <label>管阀选择</label>
                    <select id="pipeValve-${index}">
                        <option value="0">无管阀</option>
                        <option value="400">1路管阀（+400元）</option>
                        <option value="800">2路管阀（+800元）</option>
                        <option value="1200">3路管阀（+1200元）</option>
                        <option value="1600">4路管阀（+1600元）</option>
                    </select>
                </div>
            `;

            const fuelConfig = item.type === "燃油叉车" ? `
                <div class="config-group">
                    <label>变速箱类型</label>
                    <select id="gearBox-${index}">
                        <option value="0">标配（无加价）</option>
                        <option value="2000">自动挡（+2000元）</option>
                        <option value="3000">电子档（+3000元）</option>
                    </select>
                </div>
            ` : "";

            resultHtml += `
                <div class="price-card" id="forklift-${index}">
                    <h3>${item.brand} ${item.type}（${item.model}）</h3>
                    <p>配置说明：${item.remark}</p >
                    <p class="base-price">基础经销价：¥${item.price.toLocaleString()}</p >
                    
                    <div class="config-options">
                        <h4>可选配置</h4>
                        ${fuelConfig}
                        ${mastConfig}
                        ${attachmentConfig}

                        <div class="config-group">
                            <label>轮胎类型</label>
                            <select id="tire-${index}">
                                <option value="0">标配（无加价）</option>
                                <option value="3000">正新实心胎（+3000元）</option>
                            </select>
                        </div>

                        <div class="config-group">
                            <label>货叉配置</label>
                            <select id="fork-${index}">
                                <option value="0">标配（无加价）</option>
                                <option value="-1000">不配货叉（-1000元）</option>
                            </select>
                        </div>

                        <div class="config-group">
                            <label>货叉总长度（mm，基准1220mm，每15cm+150元）</label>
                            <input type="number" id="forkTotalLength-${index}" min="1220" step="150" value="1220">
                        </div>

                        ${item.type === "锂电叉车" ? `
                        <div class="config-group">
                            <label>电池增加电量（度，可输小数点）</label>
                            <input type="number" id="battery-${index}" min="0" step="0.1" value="0">
                        </div>
                        ` : ""}

                        <div class="config-group">
                            <label>门架长度增加（cm，每10cm+200元）</label>
                            <input type="number" id="mastAdd-${index}" min="0" step="10" value="0">
                        </div>

                        <div class="config-group">
                            <label>运费（元）</label>
                            <input type="number" id="freight-${index}" min="0" value="0">
                        </div>

                        <button class="calc-btn" onclick="calculateFinalPrice(${index})">计算最终价格</button>
                        <p class="final-price" id="finalPrice-${index}">最终价格：¥${item.price.toLocaleString()}</p >
                        <div class="config-summary" id="configSummary-${index}">
                            <p>当前配置：无额外加价，运费：0元</p >
                        </div>
                    </div>
                </div>
            `;
        });
        resultArea.innerHTML = resultHtml;
    }
}

function togglePipeValve(index) {
    // 保留空函数，防止报错
}

function calculateFinalPrice(index) {
    const forklift = forkliftData.filter(item => item.model.toUpperCase() === modelInput.value.trim().toUpperCase())[index];
    let totalAdd = 0;
    let configText = [];

    if (forklift.type === "燃油叉车") {
        const gearBox = parseInt(document.getElementById(`gearBox-${index}`).value) || 0;
        if (gearBox > 0) {
            totalAdd += gearBox;
            configText.push(document.getElementById(`gearBox-${index}`).options[document.getElementById(`gearBox-${index}`).selectedIndex].text);
        }
    }

    const mast = parseInt(document.getElementById(`mast-${index}`).value) || 0;
    if (mast > 0) {
        totalAdd += mast;
        configText.push(document.getElementById(`mast-${index}`).options[document.getElementById(`mast-${index}`).selectedIndex].text);
    }

    const attachment = parseInt(document.getElementById(`attachment-${index}`).value) || 0;
    if (attachment > 0) {
        totalAdd += attachment;
        configText.push(document.getElementById(`attachment-${index}`).options[document.getElementById(`attachment-${index}`).selectedIndex].text);
    }

    const pipeValve = parseInt(document.getElementById(`pipeValve-${index}`).value) || 0;
    if (pipeValve > 0) {
        totalAdd += pipeValve;
        configText.push(document.getElementById(`pipeValve-${index}`).options[document.getElementById(`pipeValve-${index}`).selectedIndex].text);
    }

    const tire = parseInt(document.getElementById(`tire-${index}`).value) || 0;
    const fork = parseInt(document.getElementById(`fork-${index}`).value) || 0;
    const mastAdd = parseInt(document.getElementById(`mastAdd-${index}`).value) || 0;
    const freight = parseInt(document.getElementById(`freight-${index}`).value) || 0;

    if (tire !== 0) { totalAdd += tire; configText.push(document.getElementById(`tire-${index}`).options[document.getElementById(`tire-${index}`).selectedIndex].text); }
    if (fork !== 0) { totalAdd += fork; configText.push(document.getElementById(`fork-${index}`).options[document.getElementById(`fork-${index}`).selectedIndex].text); }

    // 🔥 货叉：每15cm（150mm）+150元
    if (fork === 0) {
        const forkTotalLength = parseInt(document.getElementById(`forkTotalLength-${index}`).value) || 1220;
        const base = 1220;
        const over = forkTotalLength - base;
        if (over > 0) {
            const times = over / 150;
            const add = times * 150;
            totalAdd += add;
            configText.push(`货叉${forkTotalLength}mm +${add}元`);
        }
    }

    if (forklift.type === "锂电叉车") {
        const battery = parseFloat(document.getElementById(`battery-${index}`).value) || 0;
        if (battery > 0) {
            const add = battery * 1200;
            totalAdd += add;
            configText.push(`电池+${battery}度 +${add.toFixed(2)}元`);
        }
    }

    if (mastAdd > 0) {
        const add = (mastAdd / 10) * 200;
        totalAdd += add;
        configText.push(`门架加长${mastAdd}cm +${add}元`);
    }

    if (freight > 0) {
        totalAdd += freight;
        configText.push(`运费+${freight}元`);
    }

    const final = forklift.price + totalAdd;
    document.getElementById(`finalPrice-${index}`).innerText = `最终价格：¥${final.toLocaleString()}`;
    document.getElementById(`configSummary-${index}`).innerHTML = `<p>当前配置：${configText.join("、")}</p >`;
}

window.calculateFinalPrice = calculateFinalPrice;
window.togglePipeValve = togglePipeValve;