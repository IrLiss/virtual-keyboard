export default class Page {
  constructor(node, tagName = 'div', className = '', content = '', isAppend = true) {
    const el = document.createElement(tagName);
    el.className = className;
    el.innerHTML = content;
    this.node = el;

    if (isAppend) node.append(el);
    else node.prepend(el);
  }
}
