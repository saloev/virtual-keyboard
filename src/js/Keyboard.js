import DOM from './DOM';
import {
  KEYBOARD_EN, KEYBOARD_RU,
  KEYBOARD_CAPS_LOCK_RU, KEYBOARD_CAPS_LOCK_EN,
  KEYBOARD_SHIFT_RU, KEYBOARD_SHIFT_EN,
} from './data/dataUtils';


// extends Common ????
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

  language(lang) {
    if (localStorage.getItem('language')) {
      this.currentLanguage = localStorage.getItem('language');
    } else {
      localStorage.setItem('language', lang);
      this.currentLanguage = lang;
    }
  }

  static set language(lang) {
    localStorage.setItem('language', lang);
    this.language = 'lang';
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

  changeTextLanguage(changeState) {
    // TODO rewrite
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
    this.changeTextLanguage();
  }

  activeKey(e) {
    const { code } = e;
    this.keys.forEach((elem) => {
      if (elem.classList.contains(`${code}`)) {
        elem.classList.add('on');
      }
    });
  }

  removeActiveKey(e) {
    const { key, code } = e;
    this.keys.forEach((elem) => {
      const { innerText } = elem;
      if (innerText === key || elem.classList.contains(code)) {
        elem.classList.remove('on');
      }
    });
  }

  insertText(textValue, focusToTextarea = true) {
    const dispatchSpecialText = {
      CapsLock: '',
      TAB: '\t',
      Tab: '',
      Enter: '\n',
      Shift: '',
      Ctrl: '',
      Win: '',
      Alt: '',
      Space: ' ',
    };

    if (textValue === 'Backspace') {
      const newText = this.text.slice(0, -1);
      this.text = newText;
    } else {
      const newText = dispatchSpecialText[textValue] !== undefined
        ? dispatchSpecialText[textValue]
        : textValue;
      this.text = this.text.concat(newText);
    }

    if (focusToTextarea) {
      this.textarea.focus();
    }


    this.textarea.value = this.text;
  }

  shiftKeyPressed = () => {
    const capsLockLang = this.currentLanguage === 'en' ? 'shiftEN' : 'shiftRU';
    this.changeTextLanguage(capsLockLang);
  }

  keysToUpperCase = () => {
    const capsLockLang = this.currentLanguage === 'en' ? 'capsLockEN' : 'capsLockRU';
    this.changeTextLanguage(capsLockLang);
  }

  keyDown = (e) => {
    const { key, code, altKey } = e;
    if (key === 'Shift' && altKey) { this.changeLanguage(); }
    if (code === 'CapsLock') { this.keysToUpperCase(); }
    if (key === 'Shift') { this.shiftKeyPressed(); }
    this.activeKey(e);

    const textOfKey = this.keyboard.querySelector(`.${code}`).innerHTML;
    this.insertText(textOfKey);
  }

  keyUp = (e) => {
    const { key } = e;
    this.removeActiveKey(e);
    if (key === 'Shift') { this.changeTextLanguage(); }
  }

  clickKey = (e) => {
    const { target: elem } = e;
    if (elem.tagName !== 'BUTTON') return;
    if (elem.classList.contains('CapsLock')) {
      const hasOnClass = elem.classList.toggle('on');
      if (hasOnClass) {
        this.keysToUpperCase();
      } else {
        this.changeTextLanguage();
      }
    }

    this.insertText(elem.innerHTML, false);
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
