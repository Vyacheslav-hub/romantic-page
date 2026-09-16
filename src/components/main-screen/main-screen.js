import './main-screen.css';

export function createMainScreen(audio) {
    const screen = document.createElement('main');

    screen.className = 'main-screen';

    screen.innerHTML = `
        <div class="main-screen__content">

            <div class="player">

                <div class="player__cover">
                    <span>♥</span>
                </div>

                <div class="player__info">
                    <p class="player__label">
                        Сейчас играет
                    </p>

                    <h1 class="player__title">
                        Для тебя
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
                        aria-label="Предыдущий трек"
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
                        aria-label="Следующий трек"
                    >
                        ↷
                    </button>

                </div>

            </div>

        </div>
    `;

    const playButton = screen.querySelector('.player__button--play');
    const progressBar = screen.querySelector('.player__progress-bar');
    const progressFill = screen.querySelector('.player__progress-fill');

    const currentTimeElement = screen.querySelector(
        '.player__current-time',
    );

    const durationElement = screen.querySelector(
        '.player__duration',
    );

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    audio.addEventListener('play', () => {
        playButton.textContent = '❚❚';
        playButton.setAttribute('aria-label', 'Поставить на паузу');
    });

    audio.addEventListener('pause', () => {
        playButton.textContent = '▶';
        playButton.setAttribute('aria-label', 'Воспроизвести');
    });

    audio.addEventListener('loadedmetadata', () => {
        durationElement.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        const progress = audio.currentTime / audio.duration * 100;

        progressFill.style.width = `${progress}%`;

        currentTimeElement.textContent = formatTime(
            audio.currentTime,
        );
    });

    progressBar.addEventListener('click', (event) => {
        const width = progressBar.clientWidth;
        const clickPosition = event.offsetX;

        audio.currentTime =
            clickPosition / width * audio.duration;
    });

    return screen;
}

function formatTime(time) {
    if (!Number.isFinite(time)) {
        return '0:00';
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
