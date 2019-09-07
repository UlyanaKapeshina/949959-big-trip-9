import Day from './components/day.js';
import DaysList from './components/days-list.js';
import Message from './components/message.js';
import Sort from './components/sort.js';
import EventController from './event-controller';
import SortContainer from './components/sort-container';
import {remove} from './util.js';
import {getEventsInDays} from './util.js';


export default class TripController {
  constructor(container, eventsData, onDataChange) {
    this._container = container;
    this._eventsData = eventsData;
    this._creatingEvent = null;
    this._sort = new Sort();
    this._message = new Message();
    this._daysList = new DaysList();
    this._sortContainer = new SortContainer();
    this._onDataChange = this._onDataChange.bind(this);
    this._onDataChangeMain = onDataChange;
    this._subscriptions = [];
    this.onChangeView = this.onChangeView.bind(this);
  }
  init() {
    if (this._eventsData.length === 0) {
      this._renderMessage();
    }
    this._renderDaysList();
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.querySelector(`h2`).after(this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
  }
  createEvent(addButton) {
    if (this._creatingEvent) {
      return;
    }
    const defaultEvent = {
      type: ``,
      city: ``,
      price: ``,
      start: new Date(),
      end: new Date(),
      offers: [],
      isFavorite: false,
    };

    if (this._message.getElement()) {
      remove(this._message.getElement());
    }
    this._addButton = addButton;
    const eventsListContainer = this._container.querySelector(`.trip-sort`);
    this._creatingEvent = new EventController(this._addButton, defaultEvent, `add`, eventsListContainer, (...args) => {
      this._creatingEvent = null;
      this._addButton.disabled = false;
      this._onDataChange(...args);
    }, this.onChangeView);
  }
  _renderMessage() {

    this._container.append(this._message.getElement());
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
    const eventController = new EventController(this._addButton, eventData, `default`, eventsListContainer, this._onDataChange, this.onChangeView);
    this._subscriptions.push(eventController.setDefaultView.bind(eventController));
  }
  _onDataChange(newData, oldData) {
    const index = this._eventsData.findIndex((it) => it === oldData);
    if (newData === null) {
      this._eventsData = this._eventsData.slice();
      this._eventsData.splice(index, 1);
    } else if (oldData === null) {
      this._eventsData = [newData, ...this._eventsData];
    } else {
      this._eventsData[index] = newData;
    }
    if (this._eventsData.length === 0) {
      this._renderMessage();
      remove(this._daysList.getElement());
    } else {
      this._renderDaysList();
    }
    this._onDataChangeMain(this._eventsData);
  }
  onChangeView() {
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
