import Day from './components/day.js';

import Sort from './components/sort.js';
import EventController from './event-controller';
import SortContainer from './components/sort-container';

export default class TripController {
  constructor(container, eventsData, events) {
    this._container = container;
    this._eventsData = eventsData;
    this._events = events;
    this._datesData = Object.keys(eventsData);
    this._sort = new Sort();
    this._sortContainer = new SortContainer();
  }
  init() {
    this._datesData.forEach((date, index) => {
      const day = this._renderDay(date, index, this._container);
      const eventsInDayData = this._eventsData[date];
      const eventsList = day.querySelector(`.trip-events__list`);
      this._renderEvents(eventsInDayData, eventsList);
    });
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.querySelector(`h2`).after(this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
  }
  _onSortClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._container.innerHTML = ``;
    this._container.append(this._sortContainer.getElement());
    const eventsListSort = this._sortContainer.getElement().querySelector(`.trip-events__list`);
    eventsListSort.innerHTML = ``;
    switch (evt.target.dataset.sortType) {
      case `price`:
        const sortByPrice = this._events.slice().sort((a, b) => b.price - a.price);
        this._renderEvents(sortByPrice, eventsListSort);
        break;
      case `time`:
        const sortByTime = this._events.slice().sort((a, b) => (a.start - a.end) - (b.start - b.end));
        this._renderEvents(sortByTime, eventsListSort);
        break;
      case `default`:
        this._container.innerHTML = ``;
        this._datesData.forEach((date, index) => {
          const day = this._renderDay(date, index, this._container);
          const eventsInDayData = this._eventsData[date];
          const eventsList = day.querySelector(`.trip-events__list`);
          this._renderEvents(eventsInDayData, eventsList);
        });
        break;
    }
  }

  _renderDay(date, index, daysListElement) {
    const day = new Day(date, index);
    const dayElement = day.getElement();
    daysListElement.append(dayElement);
    return dayElement;
  }

  _renderEvents(eventsInDayData, eventsList) {
    eventsInDayData.map((eventData) => {
      this._renderEvent(eventData, eventsList);
    });
  }
  _renderEvent(eventData, eventsList) {
    new EventController(eventData, eventsList, this._onDataChange);
  }
  _onDataChange(newData, oldData) {
    this._datesData.forEach((date) => {
      const eventsInDayData = this._eventsData[date];
      eventsInDayData[eventsInDayData.findIndex((it) => it === oldData)] = newData;
    });
    // this._datesData.forEach((date, index) => {
    //   const day = this._renderDay(date, index, this._container);
    //   const eventsInDayData = this._eventsData[date];
    //   const eventsList = day.querySelector(`.trip-events__list`);
    //   this._renderEvents(eventsInDayData, eventsList);
    // });
  }
}
