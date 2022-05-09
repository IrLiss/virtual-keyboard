import Key from './key';

export default class FunctionKey extends Key {
  constructor(parent, code, defaultValue) {
    super(parent, 'key', code);
    this.node.textContent = defaultValue;
    this.node.className = `${this.node.className} key-${code.toLowerCase()}`;
  }
}
