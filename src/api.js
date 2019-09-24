// import {getRandomString} from './util.js';
import ModelEvent from './models/model-event.js';
import ModelOffers from './models/model-event.js';
import ModelDestinations from './models/model-destinations';

export const API = class {
  constructor({url, authorization}) {
    this._url = url;
    this._authorization = authorization;
  }

  getOffers() {
    return this._load({
      url: `${this._url}offers`
    })
    .then((response) => response.json())
    .then(ModelOffers.parseOffers);
  }
  getDestinations() {
    return this._load({
      url: `${this._url}destinations`
    })
    .then((response) => response.json())
    .then(ModelDestinations.parseDestinations);
  }
  getEvents() {
    return this._load({
      url: `${this._url}points`
    })
    .then((response) => response.json())
    .then(ModelEvent.parseEvents);

  }
  createEvent(event) {
    return this._load({
      url: `${this._url}points`,
      method: `POST`,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json());
  }
  deleteEvent(id) {
    return this._load({
      url: `${this._url}points/${id}`,
      method: `DELETE`
    });
  }
  changeEvent(id, data) {
    const dataRAW = ModelEvent.toRAW(data);

    return this._load({
      url: `${this._url}points/${id}`,
      method: `PUT`,
      body: JSON.stringify(dataRAW),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json())
    .then(ModelEvent.parseEvent);
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {

      return response;
    } else {
      throw new Error(`${response.status} : ${response.statusText}`);
    }
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(url, {method, body, headers})
    .then(this._checkStatus)

    .catch((error) => {
      console.error(`fetch error: ${error}`);
      throw error;
    });
  }
};
