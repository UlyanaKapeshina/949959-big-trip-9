import Menu from './components/menu.js';
import Filters from './components/filters.js';
import TripInfo from './components/trip-info.js';
import Stats from './components/stats.js';
import LoadingMessage from './components/loading-message.js';
import TripController from './controllers/trip-controller.js';
import {
  API
} from './api.js';
import {
  filtersNames,
  getPrice,
  remove
} from "./util.js";
import {
  render,
  RenderPosition,
  ActionType
} from "./util.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);
const tripInfoCost = document.querySelector(`.trip-info__cost`).querySelector(`span`);
const AUTORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const URL = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const api = new API({
  url: URL,
  authorization: AUTORIZATION
});

const onDataChange = (actionType, data, onError, element) => {
  switch (actionType) {
    case ActionType.DELETE:
      api.deleteEvent(data.id)
        .then(() => api.getEvents())
        .then((events) => {
          stats.update(events);
          tripController.init(events);
          tripInfoCost.innerHTML = getPrice(events);
          info.remove();
          info = renderInfo(events);
        })
        .catch(() => {
          onError();
        });
      break;
    case ActionType.CHANGE:
      api.changeEvent(data.id, data)
        .then(() => api.getEvents())
        .then((events) => {
          stats.update(events);
          tripController.init(events);
          tripInfoCost.innerHTML = getPrice(events);
          info.remove();
          info = renderInfo(events);
        })
        .catch(() => {
          onError();
        });
      break;
    case ActionType.CREATE:
      api.createEvent(data)
        .then(() => api.getEvents())
        .then((events) => {
          stats.update(events);

          tripController.init(events);
          tripInfoCost.innerHTML = getPrice(events);
          info.remove();
          info = renderInfo(events);
          remove(element);
        })
        .catch(() => {
          onError();
        });
  }
};

const renderInfo = (events) => {
  const info = new TripInfo(events);
  if (events.length !== 0) {
    render(tripInfo, info.getElement(), RenderPosition.AFTERBEGIN);
  }
  return info.getElement();
};
const menu = new Menu();
const filters = new Filters(filtersNames);
const stats = new Stats();
const loadingMessage = new LoadingMessage();
const tripController = new TripController(tripEvents, onDataChange);

render(tripControls.querySelector(`h2`), menu.getElement(), RenderPosition.AFTER);
render(tripControls, filters.getElement(), RenderPosition.BEFOREEND);
render(tripEvents, stats.getElement(), RenderPosition.BEFOREEND);
render(tripEvents, loadingMessage.getElement(), RenderPosition.BEFOREEND);

let info;
let allOffers;
let allDestinations;
(Promise.all([api.getOffers(), api.getDestinations(), api.getEvents()])
  .then(([offers, destinations, events]) => {
    allOffers = offers;
    allDestinations = destinations;

    stats.getStatistics(events);
    tripController.init(events);
    tripInfoCost.innerHTML = getPrice(events);
    info = renderInfo(events);

  }))
.then(() => {
  remove(loadingMessage.getElement());
});

export {
  allOffers,
  allDestinations
};

const onAddEventButtonClick = () => {
  addButton.disabled = true;
  tripController.createEvent(addButton);
  tripController.onChangeView();
  stats.hide();
  tripController.show();
  Array.from(menu.getElement().querySelectorAll(`a`)).find((a) => a.text === `Table`).classList.add(`trip-tabs__btn--active`);
  Array.from(menu.getElement().querySelectorAll(`a`)).find((a) => a.text === `Stats`).classList.remove(`trip-tabs__btn--active`);
};

const onMenuClick = (evt) => {
  if (evt.target.tagName !== `A`) {
    return;
  }
  menu.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
  evt.target.classList.add(`trip-tabs__btn--active`);

  switch (evt.target.textContent) {
    case `Table`:
      stats.hide();
      tripController.show();
      filters.getElement().classList.remove(`visually-hidden`);
      break;
    case `Stats`:
      tripController.hide();
      filters.getElement().classList.add(`visually-hidden`);
      stats.show();
  }
};

const onFilterClick = () => {
  tripController.init();
};

menu.getElement().addEventListener(`click`, onMenuClick);
addButton.addEventListener(`click`, onAddEventButtonClick);
filters.getElement().addEventListener(`change`, onFilterClick);
