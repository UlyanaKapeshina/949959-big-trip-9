import Event from './components/event.js';
import EventEdit from './components/event-edit.js';
import {
  OPTIONS,
  TYPES_OF_EVENT
} from "./data.js";
export default class EventController {
  constructor(eventData, mode, container, onDataChange, onChangeView) {
    this._container = container;
    this._mode = mode;
    this._eventData = eventData;
    this._event = new Event(eventData);
    this._eventEdit = new EventEdit(eventData);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this.create();
  }

  create() {
    switch (this._mode) {
      case `add`:
        this._container.after(this._eventEdit.getElement());

        this._eventEdit.getElement().querySelector(`form`).classList.add(`trip-events__item`);
        this._eventEdit.getElement().querySelector(`.event__rollup-btn`).remove();
        this._eventEdit.getElement().style = `list-style: none`;
        break;
      case `default`:
        this._container.append(this._event.getElement());
        break;
    }

    const onEscKeydown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        evt.preventDefault();
        if (this._mode === `default`) {
          this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        } else {
          this._onDataChange(null, null);
        }
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    this._event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      this._onChangeView();
      this._container.replaceChild(this._eventEdit.getElement(), this._event.getElement());

      document.addEventListener(`keydown`, onEscKeydown);
    });
    if (this._mode === `default`) {
      this._eventEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
        this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeydown);
      });

      this._eventEdit.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, () => {
        this._onDataChange(null, this._eventData);
        document.removeEventListener(`keydown`, onEscKeydown);
      });
    }


    this._eventEdit.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));
      const entry = {
        type: TYPES_OF_EVENT.find((it) => it.type === formData.get(`event-type`)),
        city: formData.get(`event-destination`),
        price: formData.get(`event-price`),
        start: new Date(formData.get(`event-start-time`)),
        end: new Date(formData.get(`event-end-time`)),
        offers: OPTIONS.filter((option) => {
          return formData.has(`event-offer-${option.id}`);
        }),
        isFavorite: formData.get(`event-favorite`) === `on` ? true : false,
      };
      this._onDataChange(entry, this._mode === `add` ? null : this._eventData);
      document.removeEventListener(`keydown`, onEscKeydown);
    });
  }
  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}
