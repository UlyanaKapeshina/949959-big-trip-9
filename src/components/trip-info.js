import {
  createElement
} from "./../util.js";
export default class TripInfo {
  constructor(cities, datesStart, datesEnd) {
    this._cities = cities;
    this._startCity = cities[0];
    this._middleCity = cities.length > 3 ? `...` : cities[1];
    this._endCity = cities[cities.length - 1];
    this._datesStartTrip = new Date(datesStart[0]);
    this._datesEndTrip = new Date(datesEnd[datesEnd.length - 1]);
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
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._startCity} &mdash; ${this._middleCity} &mdash; ${this._endCity}</h1>
    <p class="trip-info__dates">${this._datesStartTrip.toDateString().slice(4)}&nbsp;&mdash;&nbsp;${this._datesEndTrip.toDateString().slice(4)}</p>

    </div>`;
  }
}
