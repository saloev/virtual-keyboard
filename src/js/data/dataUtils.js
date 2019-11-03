import {
  RU,
  EN,
  EN_KEYBOARDS_TOP_SHIFT,
  RU_KEYBOARDS_TOP_SHIFT,
  KEYBOARD_CODE,
} from './keyboardData';


const lastKeyboardRow = () => [
  { text: 'Ctrl' },
  { text: 'Win' },
  { text: 'Alt' },
  { text: 'Space', cssClass: ['keyboard__space'] },
  { text: 'Alt' },
  { text: 'Ctr' },
  { text: '&larr;' },
  { text: '&darr;' },
  { text: '&rarr;' }];


const mainKeyboardData = (lang) => {
  const keyboardRows = lang.split('$$$');

  const mainKeyboard = keyboardRows.reduce((acc, row, index) => {
    const letters = row.split('').reduce(
      (lettersAcc, symbol) => [
        ...lettersAcc,
        {
          text: symbol,
        },
      ],
      [],
    );
    let newRow;

    switch (index) {
      // row of keyboard
      case 0: {
        const specialKey = {};
        specialKey.text = 'Backspace';
        specialKey.cssClass = ['keyboard__backspace'];
        newRow = [...letters, specialKey];
        break;
      }
      case 1: {
        const specialKey = {};
        specialKey.text = 'Tab';
        specialKey.cssClass = ['keyboard__tab'];
        newRow = [specialKey, ...letters];
        break;
      }
      case 2: {
        const specialKey = {};
        specialKey.text = 'CapsLock';
        specialKey.cssClass = ['keyboard__caps-lock'];

        const specialKeyLast = {};
        specialKeyLast.text = 'Enter';
        specialKeyLast.cssClass = ['keyboard__enter'];

        newRow = [specialKey, ...letters, specialKeyLast];
        break;
      }
      default: {
        const specialKeys = {};
        specialKeys.text = 'Shift';
        specialKeys.cssClass = ['keyboard__shift'];

        const specialKeyArrowUp = {};
        specialKeyArrowUp.text = '&uarr;';
        newRow = [
          specialKeys,
          ...letters,
          specialKeyArrowUp,
          { ...specialKeys, cssClass: ['keyboard__right-shift'] },
        ];
        break;
      }
    }

    return [...acc, newRow];
  }, []);

  const keyboard = [...mainKeyboard, lastKeyboardRow()];

  // add keyCode as css
  return keyboard.map((row, index) => {
    const newRow = row.map((key, rowIndex) => {
      const { cssClass } = key;
      const newCssClass = cssClass
        ? [...cssClass, KEYBOARD_CODE[index][rowIndex]]
        : [KEYBOARD_CODE[index][rowIndex]];
      const newKey = { ...key, ...{ cssClass: newCssClass } };

      return newKey;
    });

    return newRow;
  });
};

const keyboardCapsLock = (keyboardData) => keyboardData
  .reduce((acc, keyboardRow) => {
    const keyboardRowSymbols = keyboardRow.map((symbol) => {
      const { text } = symbol;
      if (text.length > 1) return symbol;
      const textToUpperCase = text.toUpperCase();
      const newSymbol = {
        text: textToUpperCase,
      };

      return newSymbol;
    });

    return [...acc, keyboardRowSymbols];
  }, []);

const keyboardShift = (keyboardData, topShiftKeyboard) => {
  const [topRow, ...rest] = keyboardData;
  const newTopRow = topRow.map((symbol, index) => {
    const newSymbol = topShiftKeyboard[index]
      ? { ...symbol, text: topShiftKeyboard[index] }
      : symbol;
    return newSymbol;
  });
  return [newTopRow, ...rest];
};

export const KEYBOARD_RU = mainKeyboardData(RU);
export const KEYBOARD_EN = mainKeyboardData(EN);

export const KEYBOARD_CAPS_LOCK_RU = keyboardCapsLock(KEYBOARD_RU);
export const KEYBOARD_CAPS_LOCK_EN = keyboardCapsLock(KEYBOARD_EN);

export const KEYBOARD_SHIFT_RU = keyboardShift(
  KEYBOARD_CAPS_LOCK_RU,
  RU_KEYBOARDS_TOP_SHIFT,
);
export const KEYBOARD_SHIFT_EN = keyboardShift(
  KEYBOARD_CAPS_LOCK_EN,
  EN_KEYBOARDS_TOP_SHIFT,
);
