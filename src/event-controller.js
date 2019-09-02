import Event from './components/event.js';
import EventEdit from './components/event-edit.js';
import {
  OPTIONS,
  TYPES_OF_EVENT
} from "./data.js";

export default class TripController {
  constructor(eventData, container, onDataChange, onChangeView) {
    this._container = container;
    this._eventData = eventData;
    this._event = new Event(eventData);
    this._eventEdit = new EventEdit(eventData);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this.create();
  }

  create() {
    this._container.append(this._event.getElement());

    const onEscKeydown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    this._event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      this._onChangeView();
      this._container.replaceChild(this._eventEdit.getElement(), this._event.getElement());

      document.addEventListener(`keydown`, onEscKeydown);
    });
    this._eventEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    this._eventEdit.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));
      const entry = {
        type: TYPES_OF_EVENT[TYPES_OF_EVENT.findIndex((it) => it.type === formData.get(`event-type`))],
        city: formData.get(`event-destination`),
        price: formData.get(`event-price`),
        start: new Date(formData.get(`event-start-time`)),
        end: new Date(formData.get(`event-end-time`)),
        offers: OPTIONS.filter((option) => {
          return formData.get(`event-offer-${option.id}`);
        }),
        isFavorite: formData.get(`event-favorite`) === `on` ? true : false,
      };
      this._onDataChange(entry, this._eventData);

      // this._eventsData[this._eventsData.findIndex((it) => it === eventData)] = entry;

      // container.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeydown);
    });
  }
  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}
