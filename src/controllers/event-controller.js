import Event from './../components/event.js';
import EventEdit from './../components/event-edit.js';
import {
  render,
  remove,
  RenderPosition
} from "./../util.js";
import {
  allOffers,
  allDestinations
} from './../main.js';
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
      currentView.querySelector(`.event__reset-btn`).textContent = `Cancel`;
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
        this._eventEdit._bind(`delete`);
        this._onDataChange(`delete`, this.onError(`delete`), this._eventData);
      }
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    this._eventEdit.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(evt.target);


      this._eventData.id = this._eventData.id ? this._eventData.id : ``;
      this._eventData.type = formData.get(`event-type`);
      this._eventData.destination = {
        city: formData.get(`event-destination`),
        description: allDestinations.find((it) => it.city === formData.get(`event-destination`)).description,
        pictures: allDestinations.find((it) => it.city === formData.get(`event-destination`)).pictures,
      };
      this._eventData.price = +formData.get(`event-price`);
      this._eventData.start = new Date(formData.get(`event-start-time`));
      this._eventData.end = new Date(formData.get(`event-end-time`));
      this._eventData.offers = allOffers.find((it) => it.type === formData.get(`event-type`)).offers.map((it) => {
        return {
          title: it.title,
          price: it.price,
          isChecked: formData.get(`event-offer-${it.title}`) === `on` ? true : false
        };
      });
      this._eventData.isFavorite = formData.get(`event-favorite`) === `on` ? true : false;

      this._bind(`change`);

      this._onDataChange(mode === `add` ? `create` : `change`, this.onError(), this._eventData);
      document.removeEventListener(`keydown`, onEscKeydown);
    });
    render(this._container, currentView, position);
  }
  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }

  _getDisabledFormElements() {
    Array.from(this._eventEdit.getElement().querySelectorAll(`input, button`)).forEach((it) => {
      it.disabled = true;
    });
  }
  _getActiveFormElements() {
    Array.from(this._eventEdit.getElement().querySelectorAll(`input, button`)).forEach((it) => {
      it.disabled = false;
    });
  }
  _bind(type) {
    this._getDisabledFormElements();
    switch (type) {
      case `delete`:
        this._eventEdit.getElement().querySelector(`.event__reset-btn `).textContent = `Deleting..`;
        break;
      case `change`:
        this._eventEdit.getElement().querySelector(`.event__save-btn `).textContent = `Saving..`;
        break;
    }
  }

  onError(type) {
    setTimeout(() => {
      this._shake();
      this._unbind(type);
    }, 2000
  );
  }

  _shake() {
    const ANIMATION_TIMEOUT = 600;
    this._eventEdit.getElement().querySelector(`form`).style.border = `2px solid red`;
    this._eventEdit.getElement().style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._eventEdit.getElement().style.animation = ``;
      this._eventEdit.getElement().querySelector(`form`).style.border = `none`;
    }, ANIMATION_TIMEOUT);
  }
  _unbind(type) {
    this._getActiveFormElements();
    switch (type) {
      case `delete`:
        this._eventEdit.getElement().querySelector(`.event__reset-btn `).textContent = `Delete..`;
        break;
      case `change`:
        this._eventEdit.getElement().querySelector(`.event__save-btn `).textContent = `Save`;
        break;
    }
  }
}
