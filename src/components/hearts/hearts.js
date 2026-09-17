import './hearts.css';

const heartTypes = ['♥', '♥', '♡', '❤'];

const heartColors = [
    '#ff4f81',
    '#ff668e',
    '#ff7fa3',
    '#ff9ab7',
    '#f84f78',
];

export function createHearts() {
    const container = document.createElement('div');

    container.className = 'hearts';

    return container;
}

export function createHeart(container) {
    const heart = document.createElement('span');

    heart.className = 'heart';

    heart.textContent =
        heartTypes[
            Math.floor(Math.random() * heartTypes.length)
            ];

    const size = random(10, 22);
    const duration = random(6, 11);
    const left = random(0, 100);
    const rotation = random(-25, 25);
    const drift = random(-80, 80);
    const delay = random(0, 0.5);

    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;

    heart.style.setProperty(
        '--rotation',
        `${rotation}deg`,
    );

    heart.style.setProperty(
        '--drift',
        `${drift}px`,
    );

    heart.style.setProperty(
        '--heart-color',
        randomColor(),
    );

    container.append(heart);

    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

export function createHeartStorm(
    container,
    amount = 60,
) {
    createStormFlash(container);

    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            createStormHeart(container);
        }, i * 25);
    }
}

function createStormHeart(container) {
    const heart = document.createElement('span');

    heart.className = 'heart heart--storm';

    heart.textContent =
        heartTypes[
            Math.floor(Math.random() * heartTypes.length)
            ];

    const angle = random(0, Math.PI * 2);
    const distance = random(140, 520);

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    const size = random(14, 34);
    const duration = random(1.8, 3.8);
    const rotation = random(-180, 180);

    heart.style.left = '50%';
    heart.style.top = '50%';

    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    heart.style.setProperty(
        '--x',
        `${x}px`,
    );

    heart.style.setProperty(
        '--y',
        `${y}px`,
    );

    heart.style.setProperty(
        '--rotation',
        `${rotation}deg`,
    );

    heart.style.setProperty(
        '--heart-color',
        randomColor(),
    );

    container.append(heart);

    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

function createStormFlash(container) {
    const flash = document.createElement('div');

    flash.className = 'heart-storm-flash';

    container.append(flash);

    flash.addEventListener('animationend', () => {
        flash.remove();
    });
}

function randomColor() {
    return heartColors[
        Math.floor(Math.random() * heartColors.length)
        ];
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}
