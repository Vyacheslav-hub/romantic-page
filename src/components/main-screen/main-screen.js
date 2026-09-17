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

                    <div
                        class="player__progress-bar"
                        role="slider"
                        tabindex="0"
                        aria-label="Перемотка"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="0"
                    >
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
                        class="player__button player__button--play"
                        type="button"
                        aria-label="Воспроизвести"
                        >
                        <span class="player__play-icon"></span>
                        <span class="player__pause-icon">
                        <span></span>
                        <span></span>
                        </span>
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

    let heartsInterval = null;
    let triggeredMoments = new Set();
    let previousTime = 0;

    function startHearts() {
        if (heartsInterval !== null) {
            return;
        }

        heartsInterval = setInterval(() => {
            createHeart(hearts);
        }, 1400);
    }

    function stopHearts() {
        if (heartsInterval === null) {
            return;
        }

        clearInterval(heartsInterval);

        heartsInterval = null;
    }

    function toggleAudio() {
        if (audio.ended) {
            audio.currentTime = 0;
            triggeredMoments = new Set();
        }

        if (audio.paused) {
            audio.play().catch((error) => {
                console.error(
                    'Не удалось запустить аудио:',
                    error,
                );
            });
        } else {
            audio.pause();
        }
    }

    function seek(event) {
        if (!Number.isFinite(audio.duration)) {
            return;
        }

        const rect = progressBar.getBoundingClientRect();

        const position =
            (event.clientX - rect.left) / rect.width;

        const progress = Math.max(
            0,
            Math.min(1, position),
        );

        audio.currentTime =
            progress * audio.duration;
    }

    function updateProgress() {
        if (!Number.isFinite(audio.duration)) {
            return;
        }

        const progress =
            audio.currentTime / audio.duration * 100;

        progressFill.style.width = `${progress}%`;

        currentTimeElement.textContent =
            formatTime(audio.currentTime);

        progressBar.setAttribute(
            'aria-valuenow',
            String(Math.round(audio.currentTime)),
        );
    }

    function checkMoments() {
        moments.forEach((moment, index) => {
            if (
                audio.currentTime >= moment.time &&
                !triggeredMoments.has(index)
            ) {
                triggerMoment(moment);

                triggeredMoments.add(index);
            }
        });
    }

    function triggerMoment(moment) {
        switch (moment.effect) {
            case 'hearts':
                createSmallHeartBurst(
                    hearts,
                    moment.amount,
                );
                break;

            case 'heartStorm':
                createHeartStorm(
                    hearts,
                    moment.amount,
                );
                break;

            default:
                console.warn(
                    `Неизвестный эффект: ${moment.effect}`,
                );
        }
    }

    playButton.addEventListener(
        'click',
        toggleAudio,
    );

    progressBar.addEventListener(
        'click',
        seek,
    );

    audio.addEventListener('play', () => {
        screen.classList.add('main-screen--playing');

        playButton.setAttribute(
            'aria-label',
            'Пауза',
        );

        startHearts();
    });

    audio.addEventListener('pause', () => {
        screen.classList.remove('main-screen--playing');

        playButton.setAttribute(
            'aria-label',
            'Воспроизвести',
        );

        stopHearts();
    });

    audio.addEventListener('loadedmetadata', () => {
        durationElement.textContent =
            formatTime(audio.duration);

        progressBar.setAttribute(
            'aria-valuemax',
            String(Math.round(audio.duration)),
        );
    });

    audio.addEventListener('timeupdate', () => {
        updateProgress();
        checkMoments();
    });

    audio.addEventListener('seeking', () => {
        if (audio.currentTime < previousTime) {
            triggeredMoments = new Set();
        }

        previousTime = audio.currentTime;
    });

    audio.addEventListener('ended', () => {
        stopHearts();

        screen.classList.remove('main-screen--playing');

        progressFill.style.width = '0%';
        currentTimeElement.textContent = '0:00';

        triggeredMoments = new Set();

        previousTime = 0;

        playButton.setAttribute(
            'aria-label',
            'Воспроизвести',
        );
    });

    if (Number.isFinite(audio.duration)) {
        durationElement.textContent =
            formatTime(audio.duration);
    }

    return screen;
}

function createSmallHeartBurst(
    container,
    amount = 8,
) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            createHeart(container);
        }, i * 100);
    }
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
