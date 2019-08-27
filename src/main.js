const EVENT_COUNT = 16;
import Menu from './components/menu.js';
import Filters from './components/filters.js';
import TripInfo from './components/trip-info.js';
import Sort from './components/sort.js';

import DaysList from './components/days-list.js';
import Day from './components/day.js';
import Event from './components/event.js';
import EventEdit from './components/edit-event.js';

import {
  getEventsData,
  menuValues,
  TYPES_OF_TRANSFER,
  TYPES_OF_ACTIVITY,
  CITIES,
  OPTIONS,
  filtersNames,
} from "./data.js";
import {
  render,
  remove,
} from "./util.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info `);
const eventsData = getEventsData(EVENT_COUNT);
const getCities = () => {
  return eventsData.map((event) => event.city);
};

const getDatesStart = () => {
  return eventsData.map((event) => new Date(event.start));
};

const getDatesEnd = () => {
  return eventsData.map((event) => new Date(event.end));
};
const tripDaysDates = Array.from(new Set(getDatesStart().map((date) => `${date}`.slice(4, 10))));

const renderMenu = () => {
  const menu = new Menu(menuValues);
  tripControls.querySelector(`h2`).after(menu.getElement());
};
const renderFilters = () => {
  const filters = new Filters(filtersNames);
  tripControls.append(filters.getElement());
};
const renderTripInfo = () => {
  const info = new TripInfo(getCities(), getDatesStart(), getDatesEnd());
  tripInfo.prepend(info.getElement());
};
const renderSort = () => {
  const sort = new Sort();
  tripEvents.querySelector(`h2`).after(sort.getElement());
};
const renderDaysList = () => {
  const daysList = new DaysList();
  tripEvents.append(daysList.getElement());
  return daysList;
};
const renderDay = (date, index) => {
  const day = new Day(date, index);
  const a = daysList.getElement();
  a.append(day.getElement());
  return day;
};
const renderDays = () => {
  tripDaysDates.map((date, index) => {
    renderDay(date, index);
  });
};

// tripDaysDates.map((date, index) => {
//   const dayEvents = eventsData.filter((event) => {
//     const eventDate = `${new Date(event.start)}`.slice(4, 10);
//     return eventDate === date;
//   });
//   const eventsList = renderComponent(daysList, getDayTemplate(index, date), `beforeend`);


//   dayEvents.map((event) => {
//     renderComponent(eventsList().document.querySelector(`.trip-events__list`), getEventTemplate(event), `beforeend`);
//   }).join(``);
// });

renderTripInfo();
renderMenu();
renderFilters();
renderSort();
const daysList = renderDaysList();
renderDays();


// const tripEvents = document.querySelector(`.trip-events`);
// // массив с посещаемыми городами


// // итоговая стоимость путешествия из стоимости эвентов и доп.опций
// const getPrice = () => {
//   const tripPrices = eventsData.map((event) => event.price).reduce((a, b) => a + b);
//   const offersPrices = eventsData.map((event) => Array.from(event.offers).reduce((a, b) => {
//     return a + b.price;
//   }, 0)).reduce((a, b) => a + b);
//   return tripPrices + offersPrices;
// };

// renderComponent(tripControls.querySelector(`h2`), getMenuTemplate(menuValues), `afterend`);
// renderComponent(document.querySelector(`.trip-info`), getTripInfoTemplate(getCities(), getDatesStart(), getDatesEnd()), `afterbegin`);
// renderComponent(tripControls, getFiltersTemplate(filtersNames), `beforeend`);
// renderComponent(tripEvents, getSortTemplate(), `beforeend`);
// renderComponent(tripEvents, getNewEventTemplate(), `beforeend`);
// renderComponent(tripEvents, getDaysListTemplate(), `beforeend`);

// const daysList = document.querySelector(`.trip-days`);

// tripDaysDates.map((date, index) => {
//   const dayEvents = eventsData.filter((event) => {
//     const eventDate = `${new Date(event.start)}`.slice(4, 10);
//     return eventDate === date;
//   });
//   const eventsList = renderComponent(daysList, getDayTemplate(index, date), `beforeend`);
//   // const eventsList = document.querySelector(`.trip-events__list`);

//   dayEvents.map((event) => {
//     renderComponent(eventsList().document.querySelector(`.trip-events__list`), getEventTemplate(event), `beforeend`);
//   }).join(``);
// });

// // renderComponent(tripEvents, getEventTemplate(eventsData, tripDaysDates, TYPES_OF_TRANSFER, TYPES_OF_ACTIVITY, CITIES, OPTIONS), `beforeend`);
// // renderComponent(tripEvents, getEventEditTemplate(eventsData, tripDaysDates, TYPES_OF_TRANSFER, TYPES_OF_ACTIVITY, CITIES, OPTIONS), `beforeend`);
// renderComponent(document.querySelector(`.trip-info__cost`), getPrice(), `beforeend`);
