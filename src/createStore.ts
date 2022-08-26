import { Action, Reducer, StoreFactory, Subscriber } from './types';

export const createStore: StoreFactory = (reducer: Reducer, middleware?: Function) => {
  if (middleware instanceof Function) {
    return middleware(createStore)(reducer);
  }

  let state: unknown;
  const subscriptions: Subscriber[] = [];

  const store = {
    subscribe: (fn: Subscriber) => {
      subscriptions.push(fn);
      return () => subscriptions.splice(subscriptions.indexOf(fn), 1)[0];
    },
    dispatch: (action: Action): Action => {
      state = reducer(state, action);
      subscriptions.forEach((fn) => fn());
      return action;
    },
    getState: () => state
  };
  store.dispatch({payload: null, type: 'INITIALISE'});
  return store;
};