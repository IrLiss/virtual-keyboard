import Page from './page';
import dataKey from '../json/data-key.json';
import FunctionKey from './function';
import Symbol from './symbol';

export default class Keyboard extends Page {
  constructor(parent, className, lang) {
    super(parent, 'div', className);
    const keyboard = new Page(this.node, 'div', 'keyboard');
    this.rows = [
      new Page(keyboard.node, 'div', 'row row-top'),
      new Page(keyboard.node, 'div', 'row row-middle'),
      new Page(keyboard.node, 'div', 'row row-middle'),
      new Page(keyboard.node, 'div', 'row row-middle'),
      new Page(keyboard.node, 'div', 'row row-bottom'),
    ];
    this.lang = lang;
    this.renderKeyboard();
  }

  renderKeyboard() {
    this.keyList = [];

    dataKey.forEach((row, i) => {
      row.forEach((key) => {
        if (key.type === 'Symbol') {
          this.keyList.push(new Symbol(
            this.rows[i].node,
            key.code,
            key.default,
            key.shift,
            this.lang,
          ));
        } else {
          this.keyList.push(new FunctionKey(
            this.rows[i].node,
            key.code,
            key.default,
          ));
        }
      });
    });
    this.onKeys();
  }

  onKeys() {
    this.keyList.forEach((item) => {
      const key = item;
      key.onKey = () => {
        this.pressKey = key;
        this.isPress = true;
      };
    });
  }

  setPressKey(e) {
    this.pressKey = this.keyList.find((key) => key.code === e.code);
    this.isPress = true;
  }

  getPressKey() {
    const pressKey = this.isPress ? this.pressKey : null;
    this.isPress = false;
    return pressKey;
  }

  onCapsLock(isCaps) {
    this.keyList.forEach((key) => {
      if (key.caps) {
        key.caps(isCaps);
      }
    });
  }

  onShift(isShift) {
    this.keyList.forEach((key) => {
      if (key.shift) {
        key.shift(isShift);
      }
    });
  }

  onMark(pressKey) {
    if (pressKey) {
      this.markKey = this.keyList.find((key) => key.code === pressKey.code) || null;
      if (this.markKey) {
        this.markKey.node.classList.add('press');
      }
    }
  }

  offMark(e) {
    if (e) {
      this.markKey = this.keyList.find((key) => key.code === e.code) || null;
      if (this.markKey) {
        this.markKey.node.classList.remove('press');
      }
    }
  }

  switchLang(lang) {
    this.keyList.forEach((key) => {
      if (key.switchLang) {
        key.switchLang(lang);
      }
    });
  }

  resetKeyboard() {
    this.keyList.forEach((key) => {
      this.offMark(key);
    });
  }
}
