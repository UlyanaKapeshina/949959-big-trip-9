const EVENT_COUNT = 13;
import Menu from './components/menu.js';
import Filters from './components/filters.js';
import TripInfo from './components/trip-info.js';
import Stats from './components/stats.js';
import TripController from './trip-controller.js';
import {
  getEventsData,
  filtersNames,
  getPrice
} from "./data.js";
import {
  render,
  RenderPosition
} from "./util.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);
let eventsData = getEventsData(EVENT_COUNT);
const tripInfoCost = document.querySelector(`.trip-info__cost`).querySelector(`span`);

const menu = new Menu();
const filters = new Filters(filtersNames);
const stats = new Stats();
const renderInfo = () => {
  const info = new TripInfo(eventsData);
  render(tripInfo, info.getElement(), RenderPosition.AFTERBEGIN);
  return info.getElement();
};
let info = renderInfo();

const onDataChange = (events) => {
  eventsData = events;
  tripInfoCost.innerHTML = getPrice(eventsData);
  info.remove();
  info = renderInfo();
};
const tripController = new TripController(tripEvents, eventsData, onDataChange, filters);

render(tripControls.querySelector(`h2`), menu.getElement(), RenderPosition.AFTER);
render(tripControls, filters.getElement(), RenderPosition.BEFOREEND);


if (eventsData.length > 0) {

  tripInfoCost.innerHTML = getPrice(eventsData);
  render(tripEvents, stats.getElement(), RenderPosition.BEFOREEND);
  stats.hide();
  tripController.init();
}

const onAddButtonClick = () => {
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
      break;
    case `Stats`:
      tripController.hide();
      stats.show();
      stats.getStatistics(eventsData);
  }
};
menu.getElement().addEventListener(`click`, onMenuClick);
addButton.addEventListener(`click`, onAddButtonClick);
