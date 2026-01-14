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

// 全局变量存储当前选中的叉车信息
let currentForklift = null;

// DOM元素获取
const searchBtn = document.getElementById("searchBtn");
const modelInput = document.getElementById("modelInput");
const resultArea = document.getElementById("resultArea");

// 绑定查询事件
searchBtn.addEventListener("click", searchPrice);
modelInput.addEventListener("keydown", (e) => e.key === "Enter" && searchPrice());

// 价格查询函数
function searchPrice() {
    const inputModel = modelInput.value.trim().toUpperCase();
    if (!inputModel) {
        resultArea.innerHTML = '<div class="no-result">请输入有效的叉车型号</div>';
        currentForklift = null;
        return;
    }

    // 匹配型号（忽略大小写）
    const matches = forkliftData.filter(item => item.model.toUpperCase() === inputModel);

    if (matches.length === 0) {
        resultArea.innerHTML = `<div class="no-result">未查询到型号「${inputModel}」的价格信息，请核对型号是否正确</div>`;
        currentForklift = null;
    } else {
        let resultHtml = "";
        matches.forEach((item, index) => {
            // 存储当前选中的叉车（默认选第一个）
            if (index === 0) currentForklift = item;
            
            // 门架配置（仅保留类型选择）
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

            // 燃油叉车专属配置（仅变速箱类型）
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

            // 拼接HTML结构（新增运费输入框）
            resultHtml += `
                <div class="price-card" id="forklift-${index}">
                    <h3>${item.brand} ${item.type}（${item.model}）${index > 0 ? "(可选配置)" : ""}</h3>
                    <p>配置说明：${item.remark}</p >
                    <p class="base-price">基础经销价：¥${item.price.toLocaleString()}</p >
                    
                    <div class="config-options">
                        <h4>可选配置</h4>
                        ${fuelConfig} <!-- 燃油叉车显示变速箱 -->
                        ${mastConfig} <!-- 所有车型显示门架类型 -->
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
                            <label>货叉长度增加（cm，仅标配适用，每1cm+10元）</label>
                            <input type="number" id="forkLength-${index}" min="0" step="1" value="0" placeholder="输入长度增加量">
                        </div>
                        ${item.type === "锂电叉车" ? `
                            <div class="config-group">
                                <label>电池增加电量（度）</label>
                                <input type="number" id="battery-${index}" min="0" value="0" placeholder="输入增加电量">
                            </div>
                        ` : ""}
                        <div class="config-group">
                            <label>门架长度增加（cm，每10cm+200元）</label>
                            <input type="number" id="mastAdd-${index}" min="0" step="10" value="0" placeholder="输入长度增加量（10cm递增）">
                        </div>
                        <!-- 新增运费输入框 -->
                        <div class="config-group">
                            <label>运费（元，手动填写）</label>
                            <input type="number" id="freight-${index}" min="0" value="0" placeholder="输入运费金额（默认0元）">
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

// 最终价格计算函数（新增运费叠加逻辑）
function calculateFinalPrice(index) {
    const forklift = forkliftData.filter(item => item.model.toUpperCase() === modelInput.value.trim().toUpperCase())[index];
    let totalAdd = 0;
    let configText = [];

    // 1. 燃油叉车专属配置计算（仅变速箱）
    if (forklift.type === "燃油叉车") {
        const gearBox = parseInt(document.getElementById(`gearBox-${index}`).value) || 0;
        if (gearBox > 0) {
            totalAdd += gearBox;
            configText.push(document.getElementById(`gearBox-${index}`).options[document.getElementById(`gearBox-${index}`).selectedIndex].text);
        }
    }

    // 2. 门架配置计算（仅按类型固定加价）
    const mast = parseInt(document.getElementById(`mast-${index}`).value) || 0;
    if (mast > 0) {
        totalAdd += mast;
        configText.push(document.getElementById(`mast-${index}`).options[document.getElementById(`mast-${index}`).selectedIndex].text);
    }

    // 3. 通用配置计算
    const tire = parseInt(document.getElementById(`tire-${index}`).value) || 0;
    const fork = parseInt(document.getElementById(`fork-${index}`).value) || 0;
    const forkLength = parseInt(document.getElementById(`forkLength-${index}`).value) || 0;
    const mastAdd = parseInt(document.getElementById(`mastAdd-${index}`).value) || 0;
    // 新增：获取运费输入值
    const freight = parseInt(document.getElementById(`freight-${index}`).value) || 0;
    
    if (tire !== 0) {
        totalAdd += tire;
        configText.push(document.getElementById(`tire-${index}`).options[document.getElementById(`tire-${index}`).selectedIndex].text);
    }
    if (fork !== 0) {
        totalAdd += fork;
        configText.push(document.getElementById(`fork-${index}`).options[document.getElementById(`fork-${index}`).selectedIndex].text);
    }
    // 货叉长度增加加价（1cm+10元）
    if (fork === 0 && forkLength > 0) {
        const forkAdd = forkLength * 10;
        totalAdd += forkAdd;
        configText.push(`货叉长度增加${forkLength}cm（+${forkAdd}元，1cm=10元）`);
    }
    // 门架长度增加加价（10cm+200元）
    if (mastAdd > 0) {
        const mastAddPrice = (mastAdd / 10) * 200;
        totalAdd += mastAddPrice;
        configText.push(`门架长度增加${mastAdd}cm（+${mastAddPrice}元，10cm=200元）`);
    }

    // 4. 锂电叉车专属配置（电池增加）
    if (forklift.type === "锂电叉车") {
        const battery = parseInt(document.getElementById(`battery-${index}`).value) || 0;
        if (battery > 0) {
            const batteryPrice = battery * 1200;
            totalAdd += batteryPrice;
            configText.push(`电池增加${battery}度（+${batteryPrice}元）`);
        }
    }

    // 5. 叠加运费（运费默认0元，填写后自动增加）
    totalAdd += freight;
    if (freight > 0) {
        configText.push(`运费（+${freight}元）`);
    } else {
        configText.push("运费：0元");
    }

    // 计算并更新最终价格
    const finalPrice = forklift.price + totalAdd;
    document.getElementById(`finalPrice-${index}`).textContent = `最终价格：¥${finalPrice.toLocaleString()}`;
    // 更新配置汇总（包含运费信息）
    const summaryText = configText.length > 0 ? `当前配置：${configText.join("、")}` : "当前配置：无额外加价，运费：0元";
    document.getElementById(`configSummary-${index}`).innerHTML = `<p>${summaryText}</p >`;
}

// 全局函数暴露（确保HTML中可调用）
window.calculateFinalPrice = calculateFinalPrice;