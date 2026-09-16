import './styles/global.css';

import { createIntro } from './components/intro/intro.js';

const app = document.querySelector('#app');

app.append(createIntro());
