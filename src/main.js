import './scss/main.scss';

import Keyboard from './js/Keyboard';

const init = () => {
  const keyboard = new Keyboard('.keyboard');

  keyboard.init();
};

window.addEventListener('DOMContentLoaded', init);
