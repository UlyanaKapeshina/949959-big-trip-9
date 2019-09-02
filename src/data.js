import {
  getRandomElement
} from "./util.js";
import {
  getRandomArray
} from "./util.js";
import {
  getArray
} from "./util.js";
import {
  getRandomInteger
} from "./util.js";
import {
  getRandomDate
} from "./util.js";
const DESCRIPTIONS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];
export const DESTINATIONS = [{
  city: `Birmingham`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
},
{
  city: `Nottingham`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
}, {
  city: `Sheffield`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
},
{
  city: `Bristol`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
}, {
  city: `Newcastle`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
}];
const DAYS_COUNT = 5;

export const TYPES_OF_TRANSFER = [
  `Bus to`,
  `Drive to`,
  `Flight to`,
  `Ship to`,
  `Taxi to`,
  `Train to`,
  `Transport to`,
];
export const TYPES_OF_ACTIVITY = [
  `Check-in in`,
  `Restaurant in`,
  `Sightseeing in`,
];
const TYPES_OF_EVENT = TYPES_OF_TRANSFER.concat(TYPES_OF_ACTIVITY);


export const OPTIONS = [{
  id: `luggage`,
  option: `Add luggage`,
  price: 10
},
{
  id: `comfort`,
  option: `Switch to comfort class`,
  price: 150
},
{
  id: `meal`,
  option: `Add meal`,
  price: 2
},
{
  id: `seats`,
  option: `Choose seats`,
  price: 9
},
];

// описание одного эвента

const getEvent = () => {
  const type = getRandomElement(TYPES_OF_EVENT);
  const start = getRandomDate(DAYS_COUNT);
  const residual = getRandomInteger(20, 180) * 60 * 1000;
  const end = start + residual;

  return {
    type,
    city: getRandomElement(DESTINATIONS).city,
    price: getRandomInteger(0, 1000),
    start,
    end,
    offers: new Set(getRandomArray(1, 4, OPTIONS)),
    isFavorite: false,
  };

};

// массив со всеми эвентами

export const getEventsData = (count) => {
  const events = new Array(count);
  return events.fill(``).map(getEvent).sort((a, b) => a.start - b.start);
};

export const getEventsInDays = (eventsData) => {
  return eventsData.reduce((acc, event) => {
    const date = new Date(event.start).toDateString();
    if (acc[date]) {
      acc[date].push(event);
    } else {
      acc[date] = [event];
    }
    return acc;
  }, {});
};

export const getCities = (eventsData) => {
  return eventsData.map((event) => event.city);
};

export const getPrice = ((eventsData) => {
  return eventsData.map((event) => {
    const offersPrice = Array.from(event.offers).reduce((a, b) => {
      return a + b.price;
    }, 0);
    return event.price + offersPrice;
  }).reduce((a, b) => a + b);
});

export const menuValues = [
  {
    title: `Table`,
    active: true
  },
  {
    title: `Stats`,
    active: false
  },
];

export const filtersNames = [`Everything`, `Future`, `Past`];
