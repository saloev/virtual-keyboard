export default class Common {
  constructor() {}

  /**
   *
   * @param {DOM element} elem
   * @param {String} selector
   * @param {Boolean} all
   */
  select(elem, selector, all = false) {
    return all ? elem.querySelectorAll(selector) : elem.querySelector(selector);
  }

  /**
   * @param {Array{String}} tagNames
   * @param {Array{String}} classList
   */
  createElements(tagNames, classList) {
    return tagNames.reduce((acc, tag) => {
      const newAcc = document.createElement(tag);
      classList.map(strClass => {
        newAcc.classList.add(strClass);
      });

      return [...acc, newAcc];
    }, []);
  }

  /**
   *
   * @param {DOM element} to
   * @param {Array{DOM element}} elements
   *
   */
  appendElements(to, elements) {
    const fragMent = document.createDocumentFragment();

    elements.map(elem => {
      fragMent.appendChild(elem);
    });

    to.appendChild(fragMent);
  }

  /**
   *
   */
  detectKey = e => {
    this.pressedKey = e.key;
  };

  /**
   *
   */
  addKeyUpEvent() {
    document.body.addEventListener("keyup", this.detectKey);
  }

  /**
   * removeKeyUpEvent
   */
  removeKeyUpEvent() {
    document.body.removeEventListener("keyup", this.detectKey);
  }
}
