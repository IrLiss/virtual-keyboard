import Key from './key';

export default class Symbol extends Key {
  constructor(parent, code, defaultValue, shiftValue, lang) {
    super(parent, 'key', code);
    this.defaultValue = defaultValue;
    this.shiftValue = shiftValue;
    this.lang = lang;

    if (this.defaultValue[`${this.lang}`]) {
      this.node.textContent = this.defaultValue[`${this.lang}`];
    } else {
      this.node.textContent = this.defaultValue.en;
    }
  }

  getSymbol() {
    return this.node.textContent;
  }

  caps(isCaps) {
    this.isCaps = isCaps;
    if (this.isCaps) {
      this.node.textContent = this.node.textContent.toUpperCase();
    } else if (this.isShift) {
      this.node.textContent = this.node.textContent.toUpperCase();
    } else {
      this.node.textContent = this.node.textContent.toLowerCase();
    }
  }

  shift(isShift) {
    this.isShift = isShift;
    if (this.isShift) {
      if (this.shiftValue) {
        if (this.shiftValue[`${this.lang}`]) {
          this.node.textContent = this.shiftValue[`${this.lang}`].toUpperCase();
        } else if (this.defaultValue[`${this.lang}`]) {
          this.node.textContent = this.defaultValue[`${this.lang}`].toUpperCase();
        } else {
          this.node.textContent = this.shiftValue.en;
        }
      } else if (this.defaultValue[`${this.lang}`]) {
        this.node.textContent = this.defaultValue[`${this.lang}`].toUpperCase();
      } else {
        this.node.textContent = this.defaultValue.en.toUpperCase();
      }
    } else if (this.isCaps) {
      if (this.defaultValue[`${this.lang}`]) {
        this.node.textContent = this.defaultValue[`${this.lang}`].toUpperCase();
      } else {
        this.node.textContent = this.defaultValue.en.toUpperCase();
      }
    } else if (this.defaultValue[`${this.lang}`]) {
      this.node.textContent = this.defaultValue[`${this.lang}`];
    } else {
      this.node.textContent = this.defaultValue.en;
    }
  }

  switchLang(lang) {
    this.lang = lang;
    this.node.textContent = this.defaultValue[`${lang}`] || this.defaultValue.en;

    if (this.isShift) {
      this.shift(this.isShift);
    }

    if (this.isCaps) {
      this.caps(this.isCaps);
    }
  }
}
