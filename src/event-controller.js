import Event from './components/event.js';
import EventEdit from './components/event-edit.js';
import {
  OPTIONS,
  TYPES_OF_EVENT
} from "./data.js";
import {
  render,
  remove,
  RenderPosition
} from "./util.js";
export default class EventController {
  constructor(eventData, mode, container, onDataChange, onChangeView) {
    this._container = container;

    this._eventData = eventData;
    this._event = new Event(eventData);
    this._eventEdit = new EventEdit(eventData);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this.create(mode);
  }

  create(mode) {
    let currentView = this._event;
    let position = RenderPosition.BEFOREEND;
    if (mode === `add`) {
      currentView = this._eventEdit;
      position = RenderPosition.AFTER;
      currentView.getElement().querySelector(`form`).classList.add(`trip-events__item`);
      currentView.getElement().querySelector(`.event__rollup-btn`).remove();
      currentView.getElement().style = `list-style: none`;

    }

    const onEscKeydown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        evt.preventDefault();
        if (mode === `default`) {
          this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        } else {
          remove(currentView.getElement());
          currentView.removeElement();

        }
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };
    if (mode === `add`) {

      document.addEventListener(`keydown`, onEscKeydown);
    }
    this._event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      this._onChangeView();
      this._container.replaceChild(this._eventEdit.getElement(), this._event.getElement());

      document.addEventListener(`keydown`, onEscKeydown);
    });
    if (mode === `default`) {
      this._eventEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
        this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeydown);
      });
    }

    this._eventEdit.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (mode === `add`) {
        remove(this._eventEdit.getElement());
        this._eventEdit.removeElement();
      } else {
        this._onDataChange(null, this._eventData);
      }
      document.removeEventListener(`keydown`, onEscKeydown);
    });

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
      this._onDataChange(entry, mode === `add` ? null : this._eventData);
      if (mode === `add`) {
        remove(this._eventEdit.getElement());
        this._eventEdit.removeElement();
      }
      document.removeEventListener(`keydown`, onEscKeydown);
    });
    render(this._container, currentView.getElement(), position);
  }
  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}
