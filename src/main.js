const EVENT_COUNT = 16;
import Menu from './components/menu.js';
import Filters from './components/filters.js';
import TripInfo from './components/trip-info.js';
import EventAdd from './components/event-add.js';
import TripController from './trip-controller.js';
import {
  getEventsData,
  menuValues,
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
  const menu = new Menu(menuValues);
  tripControls.querySelector(`h2`).after(menu.getElement());
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

const renderEventAdd = () => {
  const eventAdd = new EventAdd();
  tripEvents.append(eventAdd.getElement());
  addButton.disabled = true;
};

renderMenu();
renderFilters();

if (eventsData.length > 0) {
  renderTripInfo();
  const tripController = new TripController(tripEvents, eventsData);
  tripController.init();
} else {
  renderEventAdd();
}
