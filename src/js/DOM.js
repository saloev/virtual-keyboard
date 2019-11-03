export default class DOM {
  /**
   *
   * @param {HTMLElement} elem
   * @param {String} selector
   * @param {Boolean} all
   */
  static select(elem, selector, all = false) {
    return all ? elem.querySelectorAll(selector) : elem.querySelector(selector);
  }

  /**
   * @param {Array{Object}} tagNames
   * @param {Array{String}} classList
   */
  static createElements(tagNames, classList) {
    console.log(tagNames.length, tagNames);
    return tagNames.reduce((acc, { text, cssClass, tag = 'button' }) => {
      console.log(text, cssClass, tag);
      const newAcc = document.createElement(tag);
      classList.forEach((strClass) => {
        newAcc.classList.add(strClass);
      });

      if (text) {
        if (text.includes('&')) {
          newAcc.innerHTML = text;
        } else {
          newAcc.textContent = text;
        }
      }


      if (cssClass) {
        newAcc.classList.add(cssClass);
      }

      return [...acc, newAcc];
    }, []);
  }

  /**
   *
   * @param {HTMLElement} to
   * @param {Array{HTMLElement}} elements
   *
   */
  static appendElements(to, elements) {
    const fragMent = document.createDocumentFragment();

    elements.forEach((element) => {
      fragMent.appendChild(element);
    });

    to.appendChild(fragMent);
  }

  /**
   *
   * @param {HTMLElement} to
   * @param {String} event
   * @param {String} method
   */
  addEventListener(to, event, method) {
    to.addEventListener(event, this[method]);
  }

  /**
   *
   * @param {HTMLElement} from
   * @param {String} event
   * @param {String} method
   */
  removeKeyUpEvent(from, event, method) {
    from.removeEventListener(event, this[method]);
  }
}
