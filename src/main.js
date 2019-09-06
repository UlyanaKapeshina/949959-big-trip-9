const EVENT_COUNT = 3;
import Menu from './components/menu.js';
import Filters from './components/filters.js';
import TripInfo from './components/trip-info.js';
import Stats from './components/stats.js';
import TripController from './trip-controller.js';
import {
  getEventsData,
  filtersNames,
  getPrice,
  getCities,
} from "./data.js";
import {
  render,
  RenderPosition
} from "./util.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);
const eventsData = getEventsData(EVENT_COUNT);
const tripCities = getCities(eventsData);
const price = getPrice(eventsData);
const tripInfoCost = document.querySelector(`.trip-info__cost`).querySelector(`span`);

const menu = new Menu();
const filters = new Filters(filtersNames);
const info = new TripInfo(tripCities, eventsData);
const stats = new Stats();
const tripController = new TripController(tripEvents, eventsData);

render(tripControls.querySelector(`h2`), menu.getElement(), RenderPosition.AFTER);
render(tripControls, filters.getElement(), RenderPosition.BEFOREEND);

if (eventsData.length > 0) {

  render(tripInfo, info.getElement(), RenderPosition.AFTERBEGIN);
  tripInfoCost.innerHTML = price;
  render(tripEvents, stats.getElement(), RenderPosition.BEFOREEND);
  stats.hide();
  tripController.init();
}

const onAddButtonClick = () => {
  tripController.createTask();
  // addButton.disabled = true;
  // addButton.removeEventListener(`click`, onAddButtonClick);
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
      stats.show();
      tripController.hide();
  }
};
menu.getElement().addEventListener(`click`, onMenuClick);
addButton.addEventListener(`click`, onAddButtonClick);
