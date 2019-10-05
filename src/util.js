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
      const offersPrice = event.offers.filter((it) => it.accepted).reduce((a, b) => {
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
export const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};
