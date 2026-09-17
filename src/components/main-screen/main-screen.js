import './main-screen.css';

import {
    createHearts,
    createHeart,
    createHeartStorm,
} from '../hearts/hearts.js';

import { moments } from '../../data/moments.js';

import cover from '../../assets/greenBook.jpg';

export function createMainScreen(audio) {
    const screen = document.createElement('main');

    screen.className = 'main-screen';

    const hearts = createHearts();

    screen.append(hearts);

    screen.insertAdjacentHTML('beforeend', `
        <div class="main-screen__content">

            <div class="player">

                <div class="player__cover">
                    <img
                        src="${cover}"
                        alt="Кадр из фильма «Зелёная книга»"
                    >

                </div>

                <div class="player__info">
                    <p class="player__label">
                        Фрагмент из фильма
                    </p>

                    <h1 class="player__title">
                        «Зелёная книга»
                    </h1>
                </div>

                <div class="player__progress">

                    <div class="player__progress-bar">
                        <div class="player__progress-fill"></div>
                    </div>

                    <div class="player__time">
                        <span class="player__current-time">
                            0:00
                        </span>

                        <span class="player__duration">
                            0:00
                        </span>
                    </div>

                </div>

                <div class="player__controls">

                    <button
                        class="player__button player__button--previous"
                        type="button"
                        aria-label="Назад"
                    >
                        ↶
                    </button>

                    <button
                        class="player__button player__button--play"
                        type="button"
                        aria-label="Воспроизвести"
                    >
                        ▶
                    </button>

                    <button
                        class="player__button player__button--next"
                        type="button"
                        aria-label="Вперёд"
                    >
                        ↷
                    </button>

                </div>

            </div>

        </div>
    `);

    const playButton = screen.querySelector(
        '.player__button--play',
    );

    const progressBar = screen.querySelector(
        '.player__progress-bar',
    );

    const progressFill = screen.querySelector(
        '.player__progress-fill',
    );

    const currentTimeElement = screen.querySelector(
        '.player__current-time',
    );

    const durationElement = screen.querySelector(
        '.player__duration',
    );

    function toggleAudio() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    playButton.addEventListener('click', toggleAudio);

    audio.addEventListener('play', () => {
        playButton.textContent = '❚❚';
    });

    audio.addEventListener('pause', () => {
        playButton.textContent = '▶';
    });

    audio.addEventListener('loadedmetadata', () => {
        durationElement.textContent =
            formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        updateProgress(
            audio,
            progressFill,
            currentTimeElement,
        );

        checkMoments(audio, hearts);
    });

    progressBar.addEventListener('click', (event) => {
        const progress =
            event.offsetX / progressBar.clientWidth;

        audio.currentTime =
            progress * audio.duration;
    });

    if (Number.isFinite(audio.duration)) {
        durationElement.textContent =
            formatTime(audio.duration);
    }

    if (!audio.paused) {
        playButton.textContent = '❚❚';
    }

    const heartsInterval = setInterval(() => {
        createHeart(hearts);
    }, 1400);

    audio.addEventListener('ended', () => {
        clearInterval(heartsInterval);
    });

    return screen;
}

let triggeredMoments = new Set();

function checkMoments(audio, hearts) {
    moments.forEach((moment, index) => {
        if (
            audio.currentTime >= moment.time &&
            !triggeredMoments.has(index)
        ) {
            triggerMoment(moment, hearts);

            triggeredMoments.add(index);
        }
    });
}

function triggerMoment(moment, hearts) {
    switch (moment.effect) {
        case 'hearts':
            createSmallHeartBurst(hearts);
            break;

        case 'heartStorm':
            createHeartStorm(hearts, 60);
            break;

        default:
            console.warn(
                `Неизвестный эффект: ${moment.effect}`,
            );
    }
}

function createSmallHeartBurst(container) {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createHeart(container);
        }, i * 100);
    }
}

function updateProgress(
    audio,
    progressFill,
    currentTimeElement,
) {
    if (!Number.isFinite(audio.duration)) {
        return;
    }

    const progress =
        audio.currentTime / audio.duration * 100;

    progressFill.style.width = `${progress}%`;

    currentTimeElement.textContent =
        formatTime(audio.currentTime);
}

function formatTime(time) {
    if (!Number.isFinite(time)) {
        return '0:00';
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
        .toString()
        .padStart(2, '0')}`;
}
