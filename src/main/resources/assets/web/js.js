let count = 0n;
let clickMultiplier = 1n;
let upgradeCost = 50n;
let idleIncome = 0n;
let idleUpgradeCost = 100n;
let idleInterval = null;

let savedCountToLoad = 0n;
let savedMultiplier = 1n;
let savedUpgradeCost = 50n;
let savedIdleIncome = 0n;
let savedIdleUpgradeCost = 100n;

const unlockedAchievements = new Set();

function decodeBase64Json(base64Str) {
    if (!base64Str || base64Str === "e30=") return {}; // Если пришла пустая строка или "{}"
    try {
        const decoded = decodeURIComponent(atob(base64Str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
        return {};
    }
}

function loadAllData(base64History, base64Factors, base64Idle) {
    const select = document.getElementById('session-select');
    select.innerHTML = '';

    const sessions = decodeBase64Json(base64History);
    const sessionArray = Object.keys(sessions).map(key => {
        return { date: key, score: BigInt(sessions[key]) };
    });

    if (sessionArray.length === 0) {
        const option = document.createElement('option');
        option.text = "История пуста";
        select.appendChild(option);
    } else {
        sessionArray.sort((a, b) => (a.score > b.score ? -1 : a.score < b.score ? 1 : 0));
        savedCountToLoad = sessionArray[0].score;

        sessionArray.forEach((session, index) => {
            const option = document.createElement('option');
            option.value = session.score.toString();
            if (index === 0) {
                option.text = "👑 " + session.date + " (Всего: " + formatNumber(session.score) + ") [САМЫЙ ЛУЧШИЙ]";
                option.style.color = "#f59e0b";
                option.style.fontWeight = "bold";
            } else {
                option.text = session.date + " (Всего: " + formatNumber(session.score) + ")";
            }
            select.appendChild(option);
        });
    }

    const factors = decodeBase64Json(base64Factors);
    const factorKeys = Object.keys(factors);
    if (factorKeys.length > 0) {
        let maxLvl = 1n;
        let correspondingCost = 50n;
        factorKeys.forEach(key => {
            if (factors[key] && factors[key].lvl) {
                const currentLvl = BigInt(factors[key].lvl);
                if (currentLvl > maxLvl) {
                    maxLvl = currentLvl;
                    correspondingCost = BigInt(factors[key].cost || 50);
                }
            }
        });
        savedMultiplier = maxLvl;
        savedUpgradeCost = correspondingCost;
    } else {
        savedMultiplier = 1n;
        savedUpgradeCost = 50n;
    }

    const idles = decodeBase64Json(base64Idle);
    const idleKeys = Object.keys(idles);
    if (idleKeys.length > 0) {
        let maxIdleLvl = 0n;
        let correspondingIdleCost = 100n;
        idleKeys.forEach(key => {
            if (idles[key] && idles[key].lvl) {
                const currentIdleLvl = BigInt(idles[key].lvl);
                if (currentIdleLvl > maxIdleLvl) {
                    maxIdleLvl = currentIdleLvl;
                    correspondingIdleCost = BigInt(idles[key].cost || 100);
                }
            }
        });
        savedIdleIncome = maxIdleLvl;
        savedIdleUpgradeCost = correspondingIdleCost;
    } else {
        savedIdleIncome = 0n;
        savedIdleUpgradeCost = 100n;
    }

    if (savedCountToLoad > 0n || savedMultiplier > 1n || savedIdleIncome > 0n) {
        showLoadProgressModal();
    }
}

function formatNumber(num) {
    return BigInt(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function updateCounterStyle(length) {
    const counter = document.getElementById('counter');
    if (length > 15) counter.style.fontSize = "32px";
    else if (length > 11) counter.style.fontSize = "42px";
    else if (length > 8) counter.style.fontSize = "54px";
    else counter.style.fontSize = "80px";
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
    checkAchievements();
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
        document.getElementById('counter').innerText = formattedCount;
        updateCounterStyle(formattedCount.length);
        document.getElementById('multiplier-val').innerText = 'x' + formatNumber(clickMultiplier);
        document.getElementById('upgrade-cost-val').innerText = formatNumber(upgradeCost);

        if (window.javaApp) {
            const now = new Date();
            const timeKey = now.toLocaleDateString() + " " + now.toLocaleTimeString() + "." + String(now.getMilliseconds()).padStart(2, '0');

            window.javaApp.logClick(count.toString());
            window.javaApp.logFactor(timeKey, clickMultiplier.toString(), upgradeCost.toString());
        }
        checkAchievements();
    } else {
        alert("Недостаточно кликов! Нужно: " + formatNumber(upgradeCost));
    }
}

function buyIdle() {
    if (count >= idleUpgradeCost) {
        count -= idleUpgradeCost;
        if (idleIncome === 0n) idleIncome = 1n;
        else idleIncome *= 2n;
        idleUpgradeCost *= 2n;

        const formattedCount = formatNumber(count);
        document.getElementById('counter').innerText = formattedCount;
        updateCounterStyle(formattedCount.length);
        document.getElementById('idle-val').innerText = formatNumber(idleIncome) + '/сек';
        document.getElementById('idle-cost-val').innerText = formatNumber(idleUpgradeCost);

        if (window.javaApp) {
            const now = new Date();
            const timeKey = now.toLocaleDateString() + " " + now.toLocaleTimeString() + "." + String(now.getMilliseconds()).padStart(2, '0');

            window.javaApp.logClick(count.toString());
            window.javaApp.logIdle(timeKey, idleIncome.toString(), idleUpgradeCost.toString());
            window.javaApp.buyIdle();
        }
        startIdleInterval();
        checkAchievements();
    } else {
        alert("Недостаточно кликов для покупки шахты! Нужно: " + formatNumber(idleUpgradeCost));
    }
}


function startIdleInterval() {
    if (!idleInterval && idleIncome > 0n) {
        idleInterval = setInterval(() => {
            count += idleIncome;
            const currentFormatted = formatNumber(count);
            document.getElementById('counter').innerText = currentFormatted;
            updateCounterStyle(currentFormatted.length);
            if (window.javaApp) {
                window.javaApp.logClick(count.toString());
            }
            checkAchievements();
        }, 1000);
    }
}

function showLoadProgressModal() {
    const modal = document.createElement('div');
    modal.id = 'progress-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(15, 23, 42, 0.85)';
    modal.style.backdropFilter = 'blur(8px)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';

    const content = document.createElement('div');
    content.style.background = '#1e1e2e';
    content.style.border = '2px solid #f59e0b';
    content.style.borderRadius = '20px';
    content.style.padding = '30px';
    content.style.width = '420px';
    content.style.textAlign = 'center';
    content.style.color = '#fff';
    content.style.boxShadow = '0 20px 50px rgba(0,0,0,0.6)';

    const title = document.createElement('h3');
    title.innerText = 'Восстановление прогресса';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#f59e0b';

    const text = document.createElement('p');
    text.innerText = 'Хотите загрузить ваш прошлый лучший прогресс и уровни апгрейдов?';
    text.style.fontSize = '15px';
    text.style.margin = '0 0 20px 0';

    const timerText = document.createElement('div');
    timerText.id = 'modal-timer-val';
    timerText.innerText = 'Осталось времени: 10 сек';
    timerText.style.color = '#ef4444';
    timerText.style.fontWeight = 'bold';
    timerText.style.marginBottom = '25px';

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '15px';
    btnContainer.style.justifyContent = 'center';

    const yesBtn = document.createElement('button');
    yesBtn.innerText = 'Да';
    yesBtn.style.background = '#10b981';
    yesBtn.style.color = '#fff';
    yesBtn.style.border = 'none';
    yesBtn.style.padding = '12px 35px';
    yesBtn.style.borderRadius = '10px';
    yesBtn.style.cursor = 'pointer';
    yesBtn.style.fontWeight = 'bold';

    const noBtn = document.createElement('button');
    noBtn.innerText = 'Нет';
    noBtn.style.background = '#374151';
    noBtn.style.color = '#fff';
    noBtn.style.border = 'none';
    noBtn.style.padding = '12px 35px';
    noBtn.style.borderRadius = '10px';
    noBtn.style.cursor = 'pointer';
    noBtn.style.fontWeight = 'bold';

    btnContainer.appendChild(yesBtn);
    btnContainer.appendChild(noBtn);
    content.appendChild(title);
    content.appendChild(text);
    content.appendChild(timerText);
    content.appendChild(btnContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);

    let timeLeft = 10;
    const countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            document.getElementById('modal-timer-val').innerText = 'Осталось времени: ' + timeLeft + ' сек';
        } else {
            clearInterval(countdown);
            modal.remove();
        }
    }, 1000);

    yesBtn.onclick = function() {
        clearInterval(countdown);
        count = savedCountToLoad;
        clickMultiplier = savedMultiplier;
        upgradeCost = savedUpgradeCost;
        idleIncome = savedIdleIncome;
        idleUpgradeCost = savedIdleUpgradeCost;

        document.getElementById('counter').innerText = formatNumber(count);
        document.getElementById('multiplier-val').innerText = 'x' + formatNumber(clickMultiplier);
        document.getElementById('upgrade-cost-val').innerText = formatNumber(upgradeCost);
        document.getElementById('idle-val').innerText = formatNumber(idleIncome) + '/сек';
        document.getElementById('idle-cost-val').innerText = formatNumber(idleUpgradeCost);

        updateCounterStyle(formatNumber(count).length);
        startIdleInterval();
        modal.remove();
    };

    noBtn.onclick = function() {
        clearInterval(countdown);
        modal.remove();
    };
}

function showAchievement(title, desc) {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '20px';
    box.style.right = '20px';
    box.style.background = '#1e1e2e';
    box.style.border = '2px solid #f59e0b';
    box.style.borderRadius = '12px';
    box.style.padding = '15px';
    box.style.color = '#fff';
    box.style.fontFamily = 'sans-serif';
    box.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
    box.style.zIndex = '9999';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.gap = '5px';

    const header = document.createElement('span');
    header.innerText = '🏆 ДОСТИЖЕНИЕ ПОЛУЧЕНО!';
    header.style.color = '#f59e0b';
    header.style.fontSize = '12px';
    header.style.fontWeight = 'bold';

    const tEl = document.createElement('span');
    tEl.innerText = title;
    tEl.style.fontWeight = 'bold';
    tEl.style.fontSize = '16px';

    const dEl = document.createElement('span');
    dEl.innerText = desc;
    dEl.style.color = '#a6adc8';
    dEl.style.fontSize = '13px';

    box.appendChild(header);
    box.appendChild(tEl);
    box.appendChild(dEl);
    document.body.appendChild(box);

    setTimeout(() => {
        box.style.transition = 'all 0.5s ease';
        box.style.opacity = '0';
        box.style.transform = 'translateY(-20px)';
        setTimeout(() => box.remove(), 500);
    }, 4000);
}

function checkAchievements() {
    if (count >= 100n && !unlockedAchievements.has('a')) { unlockedAchievements.add('a'); showAchievement('Первая сотня', 'Накликано более 100 очков!'); }
    if (count >= 1000n && !unlockedAchievements.has('b')) { unlockedAchievements.add('b'); showAchievement('Тысяча рублей?!', 'Накликано более 1 000 очков!'); }
    if (count >= 1000000n && !unlockedAchievements.has('c')) { unlockedAchievements.add('c'); showAchievement('Первый миллион', 'Накликано более 1 000 000 очков!'); }
    if (count >= 1000000000000000000000000n && !unlockedAchievements.has('d')) { unlockedAchievements.add('d'); showAchievement('Уничтожитель лимитов', 'Вы ворвались в эру Октиллионов! Scratch не осилит...'); }
    if (clickMultiplier >= 536870912n && !unlockedAchievements.has('e')) { unlockedAchievements.add('e'); showAchievement('Бешеный клик', 'Множитель кликов превысил полмиллиарда!'); }
    if (idleIncome >= 100n && !unlockedAchievements.has('f')) { unlockedAchievements.add('f'); showAchievement('Первая сотня Шахты', 'Пассивный доход от Шахт превысил 100/сек!'); }
    if (idleIncome >= 1000n && !unlockedAchievements.has('g')) { unlockedAchievements.add('g'); showAchievement('Первая тысяча Шахты', 'Пассивный доход от Шахт превысил 1 000/сек!'); }
    if (idleIncome >= 1000000n && !unlockedAchievements.has('h')) { unlockedAchievements.add('h'); showAchievement('Супердупергупермегахарооооош', 'Пассивный доход от Шахт превысил 1 000 000/сек!'); }
    if (count >= 1000000000000000000000000000n && !unlockedAchievements.has('i')) { unlockedAchievements.add('i'); showAchievement('Покоритель Вселенной', 'Октиллион кликов взят! Вы накопили больше, чем атомов в вашем теле.'); }
    if (count >= 10000000000000000000000000000n && !unlockedAchievements.has('j')) { unlockedAchievements.add('j'); showAchievement('Мамкин хацкер', 'Авто-кликер хренов!'); }
}

window.updateIdleUI = function(newCountStr, currentIdleStr, nextCostStr) {
};

