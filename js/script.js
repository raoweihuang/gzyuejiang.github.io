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
            
            // 门架配置
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

            // 属具选择配置
            const attachmentConfig = `
                <div class="config-group">
                    <label>属具选择类型</label>
                    <select id="attachment-${index}">
                        <option value="0">无属具（无加价）</option>
                        <option value="2500">侧移（+2500元）</option>
                        <option value="3000">倾翻装置（+3000元）</option>
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

            // 拼接HTML结构（货叉长度输入框：step=150 强制150mm递增）
            resultHtml += `
                <div class="price-card" id="forklift-${index}">
                    <h3>${item.brand} ${item.type}（${item.model}）${index > 0 ? "(可选配置)" : ""}</h3>
                    <p>配置说明：${item.remark}</p >
                    <p class="base-price">基础经销价：¥${item.price.toLocaleString()}</p >
                    
                    <div class="config-options">
                        <h4>可选配置</h4>
                        ${fuelConfig} <!-- 燃油叉车显示变速箱 -->
                        ${mastConfig} <!-- 门架类型 -->
                        ${attachmentConfig} <!-- 属具选择 -->
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
                        <!-- 🔥 核心修改：step=150 强制150mm递增，提示文字明确 -->
                        <div class="config-group">
                            <label>货叉总长度（mm，元）</label>
                            <input type="number" id="forkTotalLength-${index}" min="1220" step="150" value="1220" >
                        </div>
                        ${item.type === "锂电叉车" ? `
                            <div class="config-group">
                                <label>电池增加电量（度）</label>
                                <input type="number" id="battery-${index}" min="0" value="0" placeholder="输入增加电量">
                            </div>
                        ` : ""}
                        <div class="config-group">
                            <label>门架长度增加（cm，元）</label>
                            <input type="number" id="mastAdd-${index}" min="0" step="10" value="0" placeholder="输入长度增加量（10cm递增）">
                        </div>
                        <!-- 运费输入框 -->
                        <div class="config-group">
                            <label>运费（元）</label>
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

// 最终价格计算函数（适配150mm递增，简化计算）
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

    // 2. 门架配置计算
    const mast = parseInt(document.getElementById(`mast-${index}`).value) || 0;
    if (mast > 0) {
        totalAdd += mast;
        configText.push(document.getElementById(`mast-${index}`).options[document.getElementById(`mast-${index}`).selectedIndex].text);
    }

    // 3. 属具加价计算
    const attachment = parseInt(document.getElementById(`attachment-${index}`).value) || 0;
    if (attachment > 0) {
        totalAdd += attachment;
        configText.push(document.getElementById(`attachment-${index}`).options[document.getElementById(`attachment-${index}`).selectedIndex].text);
    }

    // 4. 通用配置计算
    const tire = parseInt(document.getElementById(`tire-${index}`).value) || 0;
    const fork = parseInt(document.getElementById(`fork-${index}`).value) || 0;
    const mastAdd = parseInt(document.getElementById(`mastAdd-${index}`).value) || 0;
    const freight = parseInt(document.getElementById(`freight-${index}`).value) || 0;
    
    if (tire !== 0) {
        totalAdd += tire;
        configText.push(document.getElementById(`tire-${index}`).options[document.getElementById(`tire-${index}`).selectedIndex].text);
    }
    if (fork !== 0) {
        totalAdd += fork;
        configText.push(document.getElementById(`fork-${index}`).options[document.getElementById(`fork-${index}`).selectedIndex].text);
    }

    // 🔥 货叉长度计算：适配150mm递增，无多余尾数
    if (fork === 0) { // 仅标配货叉生效
        const forkTotalLength = parseInt(document.getElementById(`forkTotalLength-${index}`).value) || 1220;
        const baseLength = 1220; // 基准长度
        const excessLength = forkTotalLength - baseLength; // 超出长度（必为150的整数倍）
        
        if (excessLength > 0) {
            const forkAddTimes = excessLength / 150; // 无需取整，输入已限制150递增
            const forkAddPrice = forkAddTimes * 200; // 每档+200元
            
            totalAdd += forkAddPrice;
            configText.push(`货叉总长度${forkTotalLength}mm（超出${excessLength}mm，${forkAddTimes}档，+${forkAddPrice}元）`);
        } else {
            configText.push(`货叉总长度${forkTotalLength}mm（基准长度，无加价）`);
        }
    }

    // 门架长度增加加价
    if (mastAdd > 0) {
        const mastAddPrice = (mastAdd / 10) * 200;
        totalAdd += mastAddPrice;
        configText.push(`门架长度增加${mastAdd}cm（+${mastAddPrice}元，10cm=200元）`);
    }

    // 5. 锂电叉车专属配置（电池增加）
    if (forklift.type === "锂电叉车") {
        const battery = parseInt(document.getElementById(`battery-${index}`).value) || 0;
        if (battery > 0) {
            const batteryPrice = battery * 1200;
            totalAdd += batteryPrice;
            configText.push(`电池增加${battery}度（+${batteryPrice}元）`);
        }
    }

    // 6. 叠加运费
    totalAdd += freight;
    if (freight > 0) {
        configText.push(`运费（+${freight}元）`);
    } else {
        configText.push("运费：0元");
    }

    // 计算并更新最终价格
    const finalPrice = forklift.price + totalAdd;
    document.getElementById(`finalPrice-${index}`).textContent = `最终价格：¥${finalPrice.toLocaleString()}`;
    // 更新配置汇总
    const summaryText = configText.length > 0 ? `当前配置：${configText.join("、")}` : "当前配置：无额外加价，运费：0元";
    document.getElementById(`configSummary-${index}`).innerHTML = `<p>${summaryText}</p >`;
}

// 全局函数暴露
window.calculateFinalPrice = calculateFinalPrice;