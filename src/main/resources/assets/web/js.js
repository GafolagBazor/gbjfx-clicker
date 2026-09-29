let count = 0;
let clickMultiplier = 1;
let upgradeCost = 50;

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
        option.text = `${key} (Всего: ${sessions[key]})`;
        select.appendChild(option);
    });
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
        window.javaApp.logClick(count);
    }
}

function buyUpgrade() {
    if (count >= upgradeCost) {
        count -= upgradeCost;
        clickMultiplier *= 2;
        upgradeCost *= 2;

        const formattedCount = formatNumber(count);
        const counter = document.getElementById('counter');
        counter.innerText = formattedCount;
        updateCounterStyle(formattedCount.length);

        document.getElementById('multiplier-val').innerText = 'x' + formatNumber(clickMultiplier);
        document.getElementById('upgrade-cost-val').innerText = formatNumber(upgradeCost);

        if (window.javaApp) {
            window.javaApp.logClick(count);
        }
    } else {
        alert("Недостаточно кликов! Нужно: " + formatNumber(upgradeCost));
    }
}

