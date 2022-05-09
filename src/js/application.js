import Page from './page';
import Keyboard from './keyboard';
import TextArea from './textarea';

export default class Application extends Page {
  constructor(parent) {
    super(parent, 'section', 'virtual-keyboard');
    this.isCaps = false;
    this.isShift = false;
    this.isCtrl = false;
    this.isAlt = false;
    this.pressedKeys = new Set();
  }

  getLang() {
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    } else {
      this.lang = 'en';
    }

    this.renderKeyboard();
  }

  renderKeyboard() {
    const container = new Page(this.node, 'div', 'vr-keyboard');
    this.title = new Page(container.node, 'h1', 'title');

    if (this.lang === 'en') {
      this.title.node.textContent = 'Virtual keyboard for RSSchool!';
    } else {
      this.title.node.textContent = 'Виртуальная клавиатура для RSSchool!';
    }

    const textContainer = new Page(container.node, 'div', 'textarea-wrapper');
    this.textArea = new TextArea(textContainer.node, 'textarea');

    this.keyboard = new Keyboard(container.node, 'wrapper', this.lang);

    this.description = new Page(container.node, 'p', 'description');
    this.description2 = new Page(container.node, 'p', 'description');

    if (this.lang === 'en') {
      this.description.node.textContent = 'The virtual keyboard is developed in JavaScript for Windows OS. Compatible with Google Chrome browser.';
      this.description2.node.textContent = 'To switch the language layout, use the combination: Shift + Alt.';
    } else {
      this.description.node.textContent = 'Виртуальная клавиатура разработанная на JavaScript OS Windows. Совместима с браузером Google Chrome.';
      this.description2.node.textContent = 'Для переключения раскладки языка комбинация: Shift+Alt.';
    }

    this.node.focus();

    window.onblur = () => {
      this.resetKeyboard();
    };

    this.node.onkeydown = (e) => {
      this.keyboard.setPressKey(e);

      this.handlePressEvent(e);
    };

    this.node.onkeyup = (e) => {
      let unpressKey;

      this.pressedKeys.forEach((key) => {
        if (key.code === e.code) {
          unpressKey = key;
          this.pressedKeys.delete(key);
        }
      });

      if (e.code.match(/Caps/)) {
        return;
      }

      if (e.code.match(/Shift/)) {
        this.isShift = false;
        this.keyboard.offMark(unpressKey);

        this.pressedKeys.forEach((key) => {
          if (key.code.match(/Shift/)) {
            this.isShift = true;
          }
        });

        if (!this.isShift) {
          this.keyboard.onShift(this.isShift);
        }
        return;
      }

      if (e.code.match(/Control/)) {
        this.isCtrl = false;
        this.keyboard.offMark(unpressKey);

        this.pressedKeys.forEach((key) => {
          if (key.code.match(/Control/)) {
            this.isCtrl = true;
          }
        });
        return;
      }

      if (e.code.match(/Alt/)) {
        this.isAlt = false;
        this.keyboard.offMark(unpressKey);

        this.pressedKeys.forEach((key) => {
          if (key.code.match(/Alt/)) {
            this.isAlt = true;
          }
        });
        return;
      }

      if (unpressKey) {
        this.keyboard.offMark(unpressKey);
      }
    };

    this.node.onmousedown = (e) => {
      this.handlePressEvent(e);
    };

    window.onmouseup = () => {
      if (this.pressKey) {
        if (this.pressKey.code.match(/Shift/)) {
          return;
        }

        if (this.pressKey.code.match(/Caps/)) {
          return;
        }

        if (this.pressKey.code.match(/Control/)) {
          return;
        }

        if (this.pressKey.code.match(/Alt/)) {
          return;
        }

        this.pressedKeys.delete(this.pressKey);
        this.textArea.node.focus();
        this.keyboard.offMark(this.pressKey);
      }
    };
  }

  handlePressEvent(e) {
    this.pressKey = this.keyboard.getPressKey();

    if (this.pressKey) {
      e.preventDefault();

      if (this.pressKey.code.match(/Shift/)) {
        this.shift();
        return;
      }

      if (this.pressKey.code.match(/Control/)) {
        this.ctrl();
        return;
      }

      if (this.pressKey.code.match(/Alt/)) {
        const isCombs = this.alt();
        if (isCombs) this.checkCombs(e);
        return;
      }

      if (this.pressKey.code.match(/Caps/)) {
        this.caps();
        return;
      }

      const isCombs = this.checkCombs(e);
      if (isCombs) {
        return;
      }

      if (this.pressKey.getSymbol) {
        this.symbol();
      }

      if (this.pressKey.code.match(/Backspace/)) {
        this.backspace();
      }

      if (this.pressKey.code.match(/Delete/)) {
        this.delete();
      }

      if (this.pressKey.code.match(/Tab/)) {
        this.tab();
      }

      if (this.pressKey.code.match(/Enter/)) {
        this.enter();
      }

      if (this.pressKey.code.match(/Space/)) {
        this.space();
      }

      if (this.pressKey.code.match(/Arrow/)) {
        this.arrow();
      }

      this.pressedKeys.add(this.pressKey);
      this.keyboard.onMark(this.pressKey);
    }
  }

  handleUnpressEvent(e) {
    if (e.type.match(/mouse/)) {
      this.pressedKeys.delete(this.pressKey);
      setTimeout(() => {
        this.keyboard.offMark(this.pressKey);
      }, 100);
    }
  }

  /*= =============================
        Change Language
============================== */
  checkCombs(e) {
    if (this.isShift) {
      if (this.pressKey.code.match(/Alt/)) {
        this.switchLang();
        this.rename();

        this.handleUnpressEvent(e);
        return true;
      }
    }

    /*= ===================================================
            Configuration Ctrl + Key(name)
==================================================== */
    if (this.isCtrl) {
      if (this.pressKey.code.match(/KeyA/)) {
        this.textArea.node.focus();
        this.textArea.selectAll();
        this.pressedKeys.add(this.pressKey);
        this.keyboard.onMark(this.pressKey);

        this.handleUnpressEvent(e);
        return true;
      }

      if (this.pressKey.code.match(/KeyC/)) {
        this.buffer = this.textArea.copy();
        this.pressedKeys.add(this.pressKey);
        this.keyboard.onMark(this.pressKey);

        this.handleUnpressEvent(e);
        return true;
      }

      if (this.pressKey.code.match(/KeyX/)) {
        this.textArea.node.focus();
        this.buffer = this.textArea.cut();
        this.pressedKeys.add(this.pressKey);
        this.keyboard.onMark(this.pressKey);

        this.handleUnpressEvent(e);
        return true;
      }

      if (this.pressKey.code.match(/KeyV/)) {
        this.textArea.paste(this.buffer);
        this.pressedKeys.add(this.pressKey);
        this.keyboard.onMark(this.pressKey);

        this.handleUnpressEvent(e);
        return true;
      }
    }
    return false;
  }

  shift() {
    if (this.isShift) {
      if (this.pressedKeys.has(this.pressKey)) {
        this.pressedKeys.delete(this.pressKey);
        this.keyboard.offMark(this.pressKey);
        this.isShift = false;

        this.pressedKeys.forEach((key) => {
          if (key.code.match(/Shift/)) {
            this.isShift = true;
          }
        });

        if (!this.isShift) {
          this.keyboard.onShift(this.isShift);
        }
      } else {
        this.pressedKeys.add(this.pressKey);
        this.keyboard.onMark(this.pressKey);
      }
    } else {
      this.isShift = !this.isShift;
      this.pressedKeys.add(this.pressKey);
      this.keyboard.onShift(this.isShift);
      this.keyboard.onMark(this.pressKey);
    }
  }

  ctrl() {
    if (this.isCtrl) {
      if (this.pressedKeys.has(this.pressKey)) {
        this.pressedKeys.delete(this.pressKey);
        this.keyboard.offMark(this.pressKey);

        this.isCtrl = false;

        this.pressedKeys.forEach((key) => {
          if (key.code.match(/Control/)) {
            this.isCtrl = true;
          }
        });
      } else {
        this.pressedKeys.add(this.pressKey);
        this.keyboard.onMark(this.pressKey);
      }
    } else {
      this.isCtrl = !this.isCtrl;
      this.pressedKeys.add(this.pressKey);
      this.keyboard.onMark(this.pressKey);
    }
  }

  alt() {
    if (this.isAlt) {
      if (this.pressedKeys.has(this.pressKey)) {
        this.pressedKeys.delete(this.pressKey);
        this.keyboard.offMark(this.pressKey);

        this.isAlt = false;

        this.pressedKeys.forEach((key) => {
          if (key.code.match(/Alt/)) {
            this.isAlt = true;
          }
        });
        return false;
      }
      this.pressedKeys.add(this.pressKey);
      this.keyboard.onMark(this.pressKey);
    } else {
      this.isAlt = !this.isAlt;
      this.pressedKeys.add(this.pressKey);
      this.keyboard.onMark(this.pressKey);
    }
    return true;
  }

  caps() {
    if (this.isCaps) {
      this.pressedKeys.delete(this.pressKey);
      this.keyboard.offMark(this.pressKey);
    } else {
      this.pressedKeys.add(this.pressKey);
      this.keyboard.onMark(this.pressKey);
    }

    this.isCaps = !this.isCaps;
    this.keyboard.onCapsLock(this.isCaps);
  }

  symbol() {
    const symbol = this.pressKey.getSymbol();
    this.textArea.printSymbol(symbol);
  }

  backspace() {
    this.textArea.backspace();
  }

  delete() {
    this.textArea.delete();
  }

  tab() {
    this.textArea.tab();
  }

  space() {
    this.textArea.space();
  }

  enter() {
    this.textArea.enter();
  }

  arrow() {
    if (this.pressKey.code.match(/Right/)) {
      if (this.isShift) {
        this.isRightDirection = true;
        this.textArea.select(this.isRightDirection);
      } else {
        this.textArea.arrowRight();
      }
      return;
    }

    if (this.pressKey.code.match(/Left/)) {
      if (this.isShift) {
        this.isRightDirection = false;
        this.textArea.select(this.isRightDirection);
      } else {
        this.textArea.arrowLeft();
      }
      return;
    }

    if (this.pressKey.code.match(/Up/)) {
      if (this.isShift) {
        this.isRightDirection = false;
        this.textArea.select(this.isRightDirection);
      } else {
        this.textArea.arrowUp();
      }
      return;
    }

    if (this.pressKey.code.match(/Down/)) {
      this.textArea.arrowDown();
    }
  }

  switchLang() {
    if (this.lang === 'en') {
      this.lang = 'ru';
    } else {
      this.lang = 'en';
    }

    localStorage.setItem('lang', this.lang);
    this.keyboard.switchLang(this.lang);
  }

  rename() {
    if (this.lang === 'en') {
      this.title.node.textContent = 'Virtual keyboard for RSSchool!';
      this.description.node.textContent = 'The virtual keyboard is developed in JavaScript for Windows OS. Compatible with Google Chrome browser.';
      this.description2.node.textContent = 'To switch the language layout, use the combination: Shift + Alt.';
    } else {
      this.title.node.textContent = 'Виртуальная клавиатура для RSSchool!';
      this.description.node.textContent = 'Виртуальная клавиатура разработанная на JavaScript OS Windows. Совместима с браузером Google Chrome.';
      this.description2.node.textContent = 'Для переключения раскладки языка комбинация: Shift+Alt.';
    }
  }

  resetKeyboard() {
    this.resetKeys({ isAlt: this.isAlt, isShift: this.isShift, isCtrl: this.isCtrl });
    this.keyboard.resetKeyboard();
  }

  resetKeys() {
    this.pressedKeys.forEach((key) => {
      this.pressedKeys.delete(key);
    });

    if (this.isAlt) {
      this.isAlt = false;
    }

    if (this.isShift) {
      this.isShift = false;
      this.keyboard.onShift(this.isShift);
    }

    if (this.isCaps) {
      this.isCaps = false;
      this.keyboard.onCapsLock(this.isShift);
    }

    if (this.isCtrl) {
      this.isCtrl = false;
    }
  }
}
