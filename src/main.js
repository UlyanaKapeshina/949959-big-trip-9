const EVENT_COUNT = 16;
import Menu from './components/menu.js';
import Filters from './components/filters.js';
import TripInfo from './components/trip-info.js';
import Stats from './components/stats.js';
import Message from './components/message.js';
import TripController from './trip-controller.js';
import {
  getEventsData,
  filtersNames,
  getPrice,
  getCities,

} from "./data.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);
const eventsData = getEventsData(EVENT_COUNT);
const tripCities = getCities(eventsData);

const price = getPrice(eventsData);
const tripInfoCost = document.querySelector(`.trip-info__cost`).querySelector(`span`);


const renderMenu = () => {
  const menu = new Menu();
  tripControls.querySelector(`h2`).after(menu.getElement());
  return menu.getElement();
};
const renderFilters = () => {
  const filters = new Filters(filtersNames);
  tripControls.append(filters.getElement());
};

const renderTripInfo = () => {
  const info = new TripInfo(tripCities, eventsData);
  tripInfo.prepend(info.getElement());
  tripInfoCost.innerHTML = price;
};

const renderMessage = () => {
  const message = new Message();
  tripEvents.append(message.getElement());
};

const stats = new Stats();




const menu = renderMenu();
const tripController = new TripController(tripEvents, eventsData);
renderFilters();

if (eventsData.length > 0) {
  renderTripInfo();
  tripController.init();
  tripEvents.append(stats.getElement());
} else {
  renderMessage();
}

const onMenuClick = (evt) => {

  if (evt.target.tagName !== `A`) {
    return;
  }
  const get
  Array.from(menu.querySelectorAll(`.trip-tabs__btn`)).forEach((it) => it.classList.remove(`.trip-tabs__btn--active`));
  evt.target.classList.add(`.trip-tabs__btn--active`);
  switch (evt.target.textContent) {
    case `Table`:
      stats.getElement().classList.add(`visually-hidden`);
      tripController.show();
      break;
    case `Stats`:
      stats.getElement().classList.remove(`visually-hidden`);
      tripController.hide();
  }
};
menu.addEventListener(`click`, onMenuClick);
