let count = 0;

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

function incrementCounter(event) {
    count++;

    const counter = document.getElementById('counter');
    counter.innerText = count;

    counter.classList.remove('pulse');
    void counter.offsetWidth;
    counter.classList.add('pulse');
    setTimeout(() => counter.classList.remove('pulse'), 150);

    createParticles(event.clientX, event.clientY);

    if (window.javaApp) {
        window.javaApp.logClick(count);
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
            p.style.transform = `translate(${mx}px, ${my}px) scale(0)`;
            p.style.opacity = '0';
        });

        setTimeout(() => p.remove(), 600);
    }
}
