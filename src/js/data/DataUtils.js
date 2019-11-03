import {
  RU,
  EN,
  EN_KEYBOARDS_TOP_SHIFT,
  RU_KEYBOARDS_TOP_SHIFT,
} from './KeyboardData';


const lastKeyboardRow = () => [{ text: 'Ctrl' },
  { text: 'Win' },
  { text: 'Alt' },
  { text: 'Space', cssClass: 'key__space' },
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
        specialKey.cssClass = 'key__backspace';
        newRow = [...letters, specialKey];
        break;
      }
      case 1: {
        const specialKey = {};
        specialKey.text = 'Tab';
        specialKey.cssClass = 'key__tab';
        newRow = [specialKey, ...letters];
        break;
      }
      case 2: {
        const specialKey = {};
        specialKey.text = 'Caps lock';
        specialKey.cssClass = 'key__caps-lock';

        const specialKeyLast = {};
        specialKeyLast.text = 'Enter';
        specialKeyLast.cssClass = 'key__enter';

        newRow = [specialKey, ...letters, specialKeyLast];
        break;
      }
      default: {
        const specialKeys = {};
        specialKeys.text = 'Shift';
        specialKeys.cssClass = 'key__shift';

        const specialKeyArrowUp = {};
        specialKeyArrowUp.text = '&uarr;';
        newRow = [
          specialKeys,
          ...letters,
          specialKeyArrowUp,
          { ...specialKeys, cssClass: 'key__right-shift' },
        ];
        break;
      }
    }

    return [...acc, newRow];
  }, []);

  return [...mainKeyboard, lastKeyboardRow()];
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

const keyboardShift = (keyboardData, topShiftKeyboard) => keyboardData
  .reduce((acc, keyboardRow, index) => {
    if (index === 0) {
      const topShiftSymbols = topShiftKeyboard.split('')
        .reduce((topShiftKeyboardAcc, symbol) => [...topShiftKeyboardAcc, { text: symbol }], []);
      return [acc, topShiftSymbols];
    }

    const keyboardRowSymbols = keyboardCapsLock(keyboardData);

    return [...acc, keyboardRowSymbols];
  }, []);

export const KEYBOARD_RU = mainKeyboardData(RU);
export const KEYBOARD_EN = mainKeyboardData(EN);

export const KEYBOARD_CAPS_LOCK_RU = keyboardCapsLock(KEYBOARD_RU);
export const KEYBOARD_CAPS_LOCK_EN = keyboardCapsLock(KEYBOARD_EN);

export const KEYBOARD_SHIFT_RU = keyboardShift(
  KEYBOARD_RU,
  RU_KEYBOARDS_TOP_SHIFT,
);
export const KEYBOARD_SHIFT_EN = keyboardShift(
  KEYBOARD_EN,
  EN_KEYBOARDS_TOP_SHIFT,
);
