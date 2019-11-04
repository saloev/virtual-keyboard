import DOM from './DOM';
import {
  KEYBOARD_EN, KEYBOARD_RU,
  KEYBOARD_CAPS_LOCK_RU, KEYBOARD_CAPS_LOCK_EN,
  KEYBOARD_SHIFT_RU, KEYBOARD_SHIFT_EN,
} from './data/dataUtils';


class Keyboard {
  constructor(selector) {
    this.keyboardSelector = selector;
  }

  init() {
    this.language('en');

    this.text = '';

    this.keyboard = DOM.select(document.body, this.keyboardSelector);
    this.keyboardData = this.currentLanguage === 'en' ? KEYBOARD_EN.flat() : KEYBOARD_RU.flat();


    this.appendKeyboard();

    this.keys = DOM.select(this.keyboard, 'button', true);
    this.addEvents();
  }

  /**
   * @param {String} lang
   */
  language(lang) {
    if (localStorage.getItem('language')) {
      this.currentLanguage = localStorage.getItem('language');
    } else {
      localStorage.setItem('language', lang);
      this.currentLanguage = lang;
    }
  }

  appendKeyboard() {
    let createdElements = DOM.createElements(this.keyboardData, [
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

    [this.textarea] = this.keyboard.children;
  }

  /**
   *
   * @param {String} changeState
   */
  changeText(changeState) {
    // TODO rewrite dispatch object
    const dispatchTextLanguage = {
      en: KEYBOARD_EN.flat(),
      ru: KEYBOARD_RU.flat(),
      capsLockRU: KEYBOARD_CAPS_LOCK_RU.flat(),
      capsLockEN: KEYBOARD_CAPS_LOCK_EN.flat(),
      shiftRU: KEYBOARD_SHIFT_RU.flat(),
      shiftEN: KEYBOARD_SHIFT_EN.flat(),
    };

    this.currentKeyboardData = !changeState
      ? dispatchTextLanguage[this.currentLanguage]
      : dispatchTextLanguage[changeState];

    this.keys.forEach((button, index) => {
      const btn = button;
      const currentText = btn.textContent;
      const newText = this.currentKeyboardData
        .find((value, newTextIndex) => newTextIndex === index)
        .text;

      if (newText !== currentText) {
        btn.innerHTML = newText;
      }
    });
  }

  changeLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
    localStorage.setItem('language', this.currentLanguage);
    this.changeText();
  }

  /**
   *
   * @param {EventObject} e
   */
  activeKey(e) {
    const { code } = e;
    this.keys.forEach((elem) => {
      if (elem.classList.contains(`${code}`)) {
        elem.classList.add('on');
      }
    });
  }

  /**
   *
   * @param {EventObject} e
   */

  removeActiveKeys(e) {
    const { code } = e;
    this.keys.forEach((elem) => {
      if (elem.classList.contains(code)) {
        setTimeout(() => {
          elem.classList.remove('on');
        }, 250);
      }
    });
  }

  /**
   *
   * @param {String} textValue
   * @param {Boolean} focusToTextarea
   */
  insertText(textValue, focusToTextarea = true) {
    const dispatchSpecialText = {
      CapsLock: '',
      Tab: '\t',
      Enter: '\n',
      Shift: '',
      Ctrl: '',
      Win: '',
      Alt: '',
      Space: ' ',
      '←': '',
      '↓': '',
      '↑': '',
      '→': '',
    };

    switch (textValue) {
      case 'Backspace': {
        const newText = this.text.slice(0, -1);
        this.text = newText;
        break;
      }

      default: {
        const newText = dispatchSpecialText[textValue] !== undefined
          ? dispatchSpecialText[textValue]
          : textValue;

        this.text = this.text.concat(newText);
        break;
      }
    }

    if (focusToTextarea) {
      this.textarea.focus();
    }


    this.textarea.value = this.text;
  }

  shiftKeyPressed = () => {
    const capsLockLang = this.currentLanguage === 'en' ? 'shiftEN' : 'shiftRU';
    this.changeText(capsLockLang);
  }

  keysToUpperCase = () => {
    const capsLockLang = this.currentLanguage === 'en' ? 'capsLockEN' : 'capsLockRU';
    this.changeText(capsLockLang);
  }

  /**
   * @param {EventObject} e
   */
  keyDown = (e) => {
    const { key, code, altKey } = e;
    if (key === 'Shift' && altKey) { this.changeLanguage(); }
    if (code === 'CapsLock') { this.keysToUpperCase(); }
    if (key === 'Shift') { this.shiftKeyPressed(); }
    this.activeKey(e);

    const textOfKey = this.keyboard.querySelector(`.${code}`).innerText;
    this.insertText(textOfKey);
  }

  /**
   * @param {EventObject} e
   */
  keyUp = (e) => {
    const { key } = e;

    this.removeActiveKeys(e);

    if (key === 'Shift' || key === 'CapsLock') { this.changeText(); }
  }

  /**
   * @param {EventObject} e
   */
  clickKey = (e) => {
    const { target: elem } = e;
    if (elem.tagName !== 'BUTTON') return;

    if (elem.classList.contains('CapsLock')) {
      const hasOnClass = elem.classList.toggle('on');
      if (hasOnClass) {
        this.keysToUpperCase();
      } else {
        this.changeText();
      }

      return;
    }

    if (elem.textContent === 'Shift') {
      this.shiftKeyPressed();

      setTimeout(() => {
        this.changeText();
      }, 200);
    }

    this.activeKey({ code: elem.classList[elem.classList.length - 1] });

    setTimeout(() => {
      this.removeActiveKeys({ code: elem.classList[elem.classList.length - 2] });
    }, 200);

    this.insertText(elem.innerText, false);
  }

  inputInTextArea = () => {
    this.textarea.value = this.text;
  }

  addEvents() {
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);

    this.keyboard.addEventListener('click', this.clickKey);

    this.textarea.addEventListener('input', this.inputInTextArea);
  }
}

export default Keyboard;
