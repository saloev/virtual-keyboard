export default class Common {
  /**
   *
   * @param {DOM element} elem
   * @param {String} selector
   * @param {Boolean} all
   */
  select(elem, selector, all = false) {
    this.selected = all
      ? elem.querySelectorAll(selector)
      : elem.querySelector(selector);
  }

  /**
   * @param {Array{String}} tagNames
   * @param {Array{String}} classList
   */
  createElements(tagNames, classList) {
    this.createdElements = tagNames.reduce((acc, tag) => {
      const newAcc = document.createElement(tag);
      classList.forEach((strClass) => {
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

    elements.forEach((element) => {
      fragMent.appendChild(element);
    });

    to.appendChild(fragMent);

    return this;
  }

  /**
   *
   */
  detectKey = (e) => {
    this.pressedKey = e.key;
  };

  /**
   *
   */
  addKeyUpEvent() {
    document.body.addEventListener('keyup', this.detectKey);
  }

  /**
   * removeKeyUpEvent
   */
  removeKeyUpEvent() {
    document.body.removeEventListener('keyup', this.detectKey);
  }
}
