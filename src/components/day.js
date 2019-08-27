import {
  createElement
} from "./../util.js";
export default class Day {
  constructor(date, index) {
    this._dayIndex = index + 1;
    this._date = new Date(date);
    this._element = null;
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    if (this._element) {
      this._element = null;
    }
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${this._dayIndex}</span>
      <time class="day__date" datetime="${this._date.toString().slice(4, 21)}">${this._date.toString().slice(4, 11)}</time>
    </div>
    <ul class="trip-events__list">
    </ul>
    </li>`;
  }
}

