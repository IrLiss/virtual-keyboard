import Page from './page';

export default class Key extends Page {
  constructor(parent, className, code) {
    super(parent, 'div', className);

    this.code = code;
    this.onKey = () => {};

    this.node.onmousedown = () => {
      this.onKey();
    };
  }
}
