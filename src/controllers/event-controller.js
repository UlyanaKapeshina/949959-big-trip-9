import Event from './../components/event.js';
import EventEdit from './../components/event-edit.js';
import {
  render,
  remove,
  RenderPosition
} from "./../util.js";
import {allOffers} from './../main.js';
export default class EventController {
  constructor(eventData, mode, container, onDataChange, onChangeView) {
    this._container = container;
    // this._addButton = addButton;

    this._eventData = eventData;
    this._event = new Event(eventData);
    this._eventEdit = new EventEdit(eventData);
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this.create(mode);
  }

  create(mode) {
    let currentView = this._event.getElement();
    let position = RenderPosition.BEFOREEND;
    if (mode === `add`) {
      currentView = this._eventEdit.getElement().querySelector(`form`);
      position = RenderPosition.AFTER;
      currentView.classList.add(`trip-events__item`);
      currentView.querySelector(`.event__rollup-btn`).remove();
    }

    const onEscKeydown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        evt.preventDefault();
        this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

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
        this._onDataChange();
        remove(currentView);
      } else {
        this._onDataChange(`delete`, this._eventData);
      }
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    this._eventEdit.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(evt.target);

      const entry = {
        id: this._eventData.id,
        type: formData.get(`event-type`),
        destination: {
          city: formData.get(`event-destination`),
          description: this._eventData.destination.description,
          pictures: this._eventData.destination.pictures
        },
        price: +formData.get(`event-price`),
        start: new Date(formData.get(`event-start-time`)),
        end: new Date(formData.get(`event-end-time`)),
        offers: allOffers.find((it) => it.type === formData.get(`event-type`)).offers.map((it) => {
          return {
            title: it.title,
            price: it.price,
            isChecked: formData.get(`event-offer-${it.title}`) === `on` ? true : false
          };
        }),
        isFavorite: formData.get(`event-favorite`) === `on` ? true : false,
      };
      this._onDataChange(`change`, this._eventData, entry);
      if (mode === `add`) {
        remove(currentView);
      }
      document.removeEventListener(`keydown`, onEscKeydown);
    });
    render(this._container, currentView, position);
  }
  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }
}
