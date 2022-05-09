import Page from './page';

export default class TextArea extends Page {
  constructor(parent, className) {
    super(parent, 'textarea', className);
    document.querySelector('textarea').setAttribute('placeholder', 'Type the text...');
    document.querySelector('textarea').focus();
  }

  getCursorData() {
    const cursorStart = this.node.selectionStart;
    const cursorEnd = this.node.selectionEnd;
    const beforeCursor = this.node.value.slice(0, cursorStart);
    const afterCursor = this.node.value.slice(cursorEnd);
    return {
      cursorStart, cursorEnd, beforeCursor, afterCursor,
    };
  }

  printSymbol(symbol) {
    const { beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    this.node.value = beforeCursor + symbol + afterCursor;
    cursorStart += 1;
    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  backspace() {
    const { cursorEnd, beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    if (cursorStart === cursorEnd) {
      if (cursorStart > 0) {
        this.node.value = beforeCursor.slice(0, beforeCursor.length - 1) + afterCursor;
        cursorStart -= 1;
      }
    } else {
      this.node.value = beforeCursor + afterCursor;
    }

    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  delete() {
    const {
      cursorStart, cursorEnd, beforeCursor, afterCursor,
    } = this.getCursorData();

    if (cursorStart === cursorEnd) {
      this.node.value = beforeCursor + afterCursor.slice(1);
    } else {
      this.node.value = beforeCursor + afterCursor;
    }

    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  tab() {
    const { beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    this.node.value = `${beforeCursor}\t${afterCursor}`;
    cursorStart += 1;
    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  space() {
    const { beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    this.node.value = `${beforeCursor} ${afterCursor}`;
    cursorStart += 1;
    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  enter() {
    const { beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    this.node.value = `${beforeCursor}\n${afterCursor}`;
    cursorStart += 1;
    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  arrowRight() {
    let { cursorStart } = this.getCursorData();
    cursorStart += 1;
    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  arrowLeft() {
    this.node.selectionStart = Math.max(0, this.node.selectionStart - 1);
    this.node.selectionEnd = this.node.selectionStart;
  }

  arrowUp() {
    const { beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    this.node.value = `${beforeCursor}↑${afterCursor}`;
    cursorStart += 1;
    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  arrowDown() {
    const { beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    this.node.value = `${beforeCursor}↓${afterCursor}`;
    cursorStart += 1;
    this.node.setSelectionRange(cursorStart, cursorStart);
  }

  select(isRightDirection) {
    let { cursorStart, cursorEnd } = this.getCursorData();

    if (cursorEnd === cursorStart) {
      this.selectDirection = isRightDirection;
    }

    if (this.selectDirection === isRightDirection) {
      if (isRightDirection) {
        cursorEnd += 1;
        this.node.setSelectionRange(cursorStart, cursorEnd);
      } else if (cursorStart > 0) {
        cursorStart -= 1;
        this.node.setSelectionRange(cursorStart, cursorEnd);
      }
    } else if (cursorEnd > cursorStart) {
      if (isRightDirection) {
        cursorStart += 1;
        this.node.setSelectionRange(cursorStart, cursorEnd);
      } else {
        cursorEnd -= 1;
        this.node.setSelectionRange(cursorStart, cursorEnd);
      }
    }
  }

  selectAll() {
    this.node.select();
  }

  copy() {
    const { cursorStart, cursorEnd } = this.getCursorData();

    if (cursorStart === cursorEnd) {
      return null;
    }

    const { value } = this.node;
    return value.slice(cursorStart, cursorEnd);
  }

  cut() {
    const { cursorStart } = this.getCursorData();
    const { cursorEnd, beforeCursor, afterCursor } = this.getCursorData();

    if (cursorStart === cursorEnd) {
      return null;
    }

    const { value } = this.node;
    const selectField = value.slice(cursorStart, cursorEnd);

    this.node.value = beforeCursor + afterCursor;

    this.node.setSelectionRange(cursorStart, cursorStart);

    return selectField;
  }

  paste(buffer) {
    const { beforeCursor, afterCursor } = this.getCursorData();
    let { cursorStart } = this.getCursorData();

    if (buffer) {
      this.node.value = beforeCursor + buffer + afterCursor;
      cursorStart += buffer.length;
      this.node.setSelectionRange(cursorStart, cursorStart);
    }
  }
}
