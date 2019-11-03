import DOM from './DOM';
import { KEYBOARD_EN } from './data/DataUtils';

// extends Common ????
class Keyboard {
  constructor(selector) {
    this.keyboardSelector = selector;
  }

  init() {
    this.keyboard = DOM.select(document.body, this.keyboardSelector);

    this.appendKeyboard();

    // const res = DataUtils.keyboardData();
    console.log(KEYBOARD_EN);
  }

  appendKeyboard(data = KEYBOARD_EN) {
    const flatArray = data.flat();
    let createdElements = DOM.createElements(flatArray, [
      'keyboard__key',
      'key',
    ]);
    const keyboardKeys = [...createdElements];

    createdElements = DOM.createElements(
      [{ tag: 'textarea' }],
      ['keyboard__input', 'textarea'],
    );
    const keyboardInput = [...createdElements];

    DOM.appendElements(this.keyboard, [...keyboardInput, ...keyboardKeys]);
  }
}

export default Keyboard;
