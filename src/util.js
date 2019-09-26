const TIME_IN_MS = 60 * 60 * 24 * 1000;
// случайный элемент из массива
export const getRandomElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

// массив случайных элементов из набора
export const getRandomArray = (min, max, array) => {
  const newArray = [];
  const newArrayLength = getRandomInteger(min, max);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push(getRandomElement(array));
  }
  return newArray;
};
// массив случайных элементов из набора
export const getRandomString = (min, max) => {
  const lettersAndNumbers = [`a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`];
  const newArray = [];
  const newArrayLength = getRandomInteger(min, max);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push(getRandomElement(lettersAndNumbers));
  }
  return newArray.join(``);
};
// массив случайных фотографий
export const getPictures = (min, max) => {
  const newArray = [];
  const newArrayLength = getRandomInteger(min, max);
  for (let i = 0; i < newArrayLength; i++) {
    newArray.push({
      url: `http://picsum.photos/300/150?r=${Math.random()}`,
      alt: `ololo`
    });
  }
  return newArray;
};

// случайное целое число из диапазона
export const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// дата в диапазоне от сегодняшнего
export const getRandomDate = (days) => {
  return Date.now() + (getRandomInteger(0, (days * 24))) * TIME_IN_MS / 24;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
export const ActionType = {
  DELETE: `delete`,
  CREATE: `create`,
  CHANGE: `change`
};
export const ModeType = {
  ADD: `add`,
  DEFAULT: `default`,
};
export const RenderPosition = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`,
  AFTER: `after`,
  BEFORE: `before`,
};

export const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTER:
      container.after(element);
      break;
    case RenderPosition.BEFORE:
      container.before(element);
      break;
  }
};

export const remove = (element) => {
  if (element) {
    element.remove();
  }
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
export const getPrice = ((eventsData) => {
  let price = 0;
  if (eventsData.length !== 0) {
    price = eventsData.map((event) => {
      const offersPrice = Array.from(event.offers).reduce((a, b) => {
        return a + b.price;
      }, 0);
      return event.price + offersPrice;
    }).reduce((a, b) => a + b);
  }
  return price;
});
export const filtersNames = [`Everything`, `Future`, `Past`];
export const TYPES_OF_TRANSFER = [{
    title: `Bus to`,
    id: `bus`,
  },
  {
    title: `Drive to`,
    id: `drive`,
  },
  {
    title: `Flight to`,
    id: `flight`,
  },
  {
    title: `Ship to`,
    id: `ship`,
  },
  {
    title: `Taxi to`,
    id: `taxi`,
  },
  {
    title: `Train to`,
    id: `train`,

  },
  {
    title: `Transport to`,
    id: `transport`,

  },
];
export const TYPES_OF_ACTIVITY = [{
    title: `Check-in in`,
    id: `check-in`,

  },
  {
    title: `Restaurant in`,
    id: `restaurant`,

  },
  {
    title: `Sightseeing in`,
    id: `sightseeing`,

  },
];
export const TYPES_OF_EVENT = TYPES_OF_TRANSFER.concat(TYPES_OF_ACTIVITY);
