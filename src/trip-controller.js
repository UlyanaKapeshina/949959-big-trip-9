import Day from './components/day.js';
import DaysList from './components/days-list.js';

import Sort from './components/sort.js';
import EventController from './event-controller';
import SortContainer from './components/sort-container';
import {remove} from './util.js';
import {getEventsInDays} from './util.js';


export default class TripController {
  constructor(container, eventsData) {
    this._container = container;
    this._eventsData = eventsData;
    this._sort = new Sort();
    this._daysList = new DaysList();
    this._sortContainer = new SortContainer();
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
  }
  init() {
    this._renderDaysList();
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.querySelector(`h2`).after(this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._daysList.getElement().innerHTML = ``;
    this._daysList.getElement().append(this._sortContainer.getElement());
    const eventsListSort = this._sortContainer.getElement().querySelector(`.trip-events__list`);
    eventsListSort.innerHTML = ``;
    switch (evt.target.dataset.sortType) {
      case `price`:
        const sortByPrice = this._eventsData.slice().sort((a, b) => b.price - a.price);
        this._renderEvents(sortByPrice, eventsListSort);
        break;
      case `time`:
        const sortByTime = this._eventsData.slice().sort((a, b) => (a.start - a.end) - (b.start - b.end));
        this._renderEvents(sortByTime, eventsListSort);
        break;
      case `default`:
        this._renderDaysList();
        break;
    }
  }
  _renderDaysList() {
    remove(this._daysList.getElement());
    this._daysList.removeElement();
    this._container.append(this._daysList.getElement());
    const eventsInDays = getEventsInDays(this._eventsData.sort((a, b) => a.start - b.start));

    const datesData = Object.keys(eventsInDays);
    datesData.forEach((date, index) => {
      const day = this._renderDay(date, index, this._daysList.getElement());
      const eventsInDayData = eventsInDays[date];
      const eventsListContainer = day.querySelector(`.trip-events__list`);
      this._renderEvents(eventsInDayData, eventsListContainer);
    });
  }

  _renderDay(date, index, daysListElement) {
    const day = new Day(date, index);
    const dayElement = day.getElement();
    daysListElement.append(dayElement);
    return dayElement;
  }

  _renderEvents(eventsInDayData, eventsListContainer) {
    eventsInDayData.map((eventData) => {
      this._renderEvent(eventData, eventsListContainer);
    });
  }
  _renderEvent(eventData, eventsListContainer) {
    const eventController = new EventController(eventData, eventsListContainer, this._onDataChange, this._onChangeView);
    this._subscriptions.push(eventController.setDefaultView.bind(eventController));
  }
  _onDataChange(newData, oldData) {
    this._eventsData[this._eventsData.findIndex((it) => it === oldData)] = newData;
    this._renderDaysList();
  }
  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
  hide() {
    this._daysList.getElement().classList.add(`visually-hidden`);
    this._sort.getElement().classList.add(`visually-hidden`);
  }
  show() {
    this._daysList.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
  }
}
