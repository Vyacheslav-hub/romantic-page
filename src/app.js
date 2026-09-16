import './styles/global.css';

import music from './assets/music.mp3';

import { createIntro } from './components/intro/intro.js';
import { createMainScreen } from './components/main-screen/main-screen.js';

const app = document.querySelector('#app');

const audio = new Audio(music);

audio.volume = 0.7;

const intro = createIntro(openPage);

app.append(intro);

function openPage() {
    intro.classList.add('intro--hidden');

    audio.play()
        .catch((error) => {
            console.error('Не удалось запустить музыку:', error);
        });

    setTimeout(() => {
        intro.remove();

        app.append(createMainScreen(audio));
    }, 1000);
}
