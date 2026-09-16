import './intro.css';

export function createIntro(onOpen) {
    const intro = document.createElement('main');

    intro.className = 'intro';

    intro.innerHTML = `
        <div class="intro__glow intro__glow--one"></div>
        <div class="intro__glow intro__glow--two"></div>

        <div class="intro__content">

            <div class="intro__heart">
                <span>♥</span>
            </div>

            <p class="intro__caption">
                Для тебя
            </p>

            <h1 class="intro__title">
                Я приготовил
                <span>кое-что особенное</span>
            </h1>

            <p class="intro__subtitle">
                Небольшая история, которую я хочу
                показать именно тебе
            </p>

            <button class="intro__button" type="button">
                <span>Открыть</span>
                <span class="intro__button-heart">♥</span>
            </button>

        </div>

        <div class="intro__hint">
            <span>нажми, чтобы продолжить</span>
        </div>
    `;

    const button = intro.querySelector('.intro__button');

    button.addEventListener('click', () => {
        onOpen();
    });

    return intro;
}
