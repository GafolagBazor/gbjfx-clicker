let count = 0n;
let clickMultiplier = 1n;
let upgradeCost = 50n;
let idleIncome = 0n;
let idleUpgradeCost = 100n;
let idleInterval = null;

function loadSessions(base64Json) {
    const select = document.getElementById('session-select');
    select.innerHTML = '';
    const decodedJson = decodeURIComponent(atob(base64Json).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const sessions = JSON.parse(decodedJson);
    const keys = Object.keys(sessions);
    if (keys.length === 0) {
        const option = document.createElement('option');
        option.text = "История пуста";
        select.appendChild(option);
        return;
    }
    keys.reverse().forEach(key => {
        const option = document.createElement('option');
        option.value = sessions[key];
        option.text = key + " (Всего: " + sessions[key] + ")";
        select.appendChild(option);
    });
}

function formatNumber(num) {
    return BigInt(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function updateCounterStyle(length) {
    const counter = document.getElementById('counter');
    if (length > 15) {
        counter.style.fontSize = "32px";
    } else if (length > 11) {
        counter.style.fontSize = "42px";
    } else if (length > 8) {
        counter.style.fontSize = "54px";
    } else {
        counter.style.fontSize = "80px";
    }
}

function incrementCounter(event) {
    count += clickMultiplier;
    const counter = document.getElementById('counter');
    const formatted = formatNumber(count);
    counter.innerText = formatted;
    updateCounterStyle(formatted.length);
    counter.classList.remove('pulse');
    void counter.offsetWidth;
    counter.classList.add('pulse');
    setTimeout(() => counter.classList.remove('pulse'), 150);
    createParticles(event.clientX, event.clientY);
    if (window.javaApp) {
        window.javaApp.logClick(count.toString());
    }
}

function createParticles(x, y) {
    const pCount = 15;
    for (let i = 0; i < pCount; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 8 + 4;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = x - size / 2 + 'px';
        p.style.top = y - size / 2 + 'px';
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 80 + 40;
        const mx = Math.cos(angle) * speed;
        const my = Math.sin(angle) * speed;
        document.body.appendChild(p);
        requestAnimationFrame(() => {
            p.style.transform = "translate(" + mx + "px, " + my + "px) scale(0)";
            p.style.opacity = '0';
        });
        setTimeout(() => p.remove(), 600);
    }
}

function buyUpgrade() {
    if (count >= upgradeCost) {
        count -= upgradeCost;
        clickMultiplier *= 2n;
        upgradeCost *= 2n;
        const formattedCount = formatNumber(count);
        const counter = document.getElementById('counter');
        counter.innerText = formattedCount;
        updateCounterStyle(formattedCount.length);
        document.getElementById('multiplier-val').innerText = 'x' + formatNumber(clickMultiplier);
        document.getElementById('upgrade-cost-val').innerText = formatNumber(upgradeCost);
        if (window.javaApp) {
            window.javaApp.logClick(count.toString());
        }
    } else {
        alert("Недостаточно кликов! Нужно: " + formatNumber(upgradeCost));
    }
}

function buyIdle() {
    if (count >= idleUpgradeCost) {
        count -= idleUpgradeCost;
        if (idleIncome === 0n) {
            idleIncome = 1n;
        } else {
            idleIncome *= 2n;
        }
        idleUpgradeCost *= 2n;
        const formattedCount = formatNumber(count);
        const counter = document.getElementById('counter');
        counter.innerText = formattedCount;
        updateCounterStyle(formattedCount.length);
        document.getElementById('idle-val').innerText = formatNumber(idleIncome) + '/сек';
        document.getElementById('idle-cost-val').innerText = formatNumber(idleUpgradeCost);
        if (window.javaApp) {
            window.javaApp.logClick(count.toString());
            window.javaApp.buyIdle();
        }
        if (!idleInterval) {
            idleInterval = setInterval(() => {
                count += idleIncome;
                const currentFormatted = formatNumber(count);
                document.getElementById('counter').innerText = currentFormatted;
                updateCounterStyle(currentFormatted.length);
                if (window.javaApp) {
                    window.javaApp.logClick(count.toString());
                }
            }, 1000);
        }
    } else {
        alert("Недостаточно кликов для покупки шахты! Нужно: " + formatNumber(idleUpgradeCost));
    }
}
