import AbstractComponent from "./abstract-component.js";
const OFFERS_COUNT = 3;
export default class Event extends AbstractComponent {
  constructor({
    type,
    city,
    price,
    start,
    end,
    offers
  }) {
    super();
    this._type = type;
    this._city = city;
    this._price = price;
    this._start = new Date(start);
    this._end = new Date(end);

    this._offers = offers;

    this._hours = Math.trunc((end - start) / 1000 / 60 / 60);
    this._minutes = Math.trunc(((end - start) / 1000 / 60 / 60 - this._hours) * 60);
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${this._type.title} ${this._city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${this._start.toString().slice(4, 21)}">${this._start.toTimeString().slice(0, 5)}</time>
          &mdash;
          <time class="event__end-time" datetime="${this._end.toString().slice(4, 21)}">${this._end.toTimeString().slice(0, 5)}</time>
        </p>
        <p class="event__duration">${this._hours}H ${this._minutes}M</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${Array.from(this._offers).slice(0, OFFERS_COUNT).map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${offer.option}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
     </li>`).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;

  }
}
