const EVENT_COUNT = 16;
import Menu from './components/menu.js';
import Filters from './components/filters.js';
import TripInfo from './components/trip-info.js';
import Sort from './components/sort.js';

import DaysList from './components/days-list.js';
import Day from './components/day.js';
import EventsList from './components/events-list.js';
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
const renderEventsList = (container) => {
  const eventsList = new EventsList();
  container.append(eventsList.getElement());
  return eventsList;
};
const renderDay = (date, index) => {
  const day = new Day(date, index);
  daysList.getElement().append(day.getElement());
  const eventsInDayData = getDayEvents(date);  // берем эвенты в эту дату
  const list = renderEventsList(day.getElement());
  renderEvents(eventsInDayData, list.getElement());
};
const renderDays = () => {
  tripDaysDates.map((date, index) => {
    const day = renderDay(date, index);
    return day;
  });
};

const renderEvent = (eventData, container) => {
  const event = new Event(eventData);
  const eventEdit = new EventEdit(eventData, TYPES_OF_TRANSFER, TYPES_OF_ACTIVITY, CITIES, OPTIONS);
  container.append(event.getElement());

  event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    container.replaceChild(eventEdit.getElement(), event.getElement());
  });
  eventEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    container.replaceChild(event.getElement(), eventEdit.getElement());
  });

  eventEdit.getElement().querySelector(`.event--edit`).addEventListener(`submit`, () => {
    container.replaceChild(event.getElement(), eventEdit.getElement());
  });
};

const renderEvents = (eventsInDayData, container) => {
  const events = eventsInDayData.map((eventData) => {
    renderEvent(eventData, container);
  });
};
const getDayEvents = (date) => {
  const dayEvents = eventsData.filter((event) => {
    return event.date === date;
  });
  return dayEvents;
};

renderTripInfo();
renderMenu();
renderFilters();
renderSort();
const daysList = renderDaysList();
renderDays();
