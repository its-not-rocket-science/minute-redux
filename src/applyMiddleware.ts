import { Middleware, Reducer, StoreFactory } from './types';

export const applyMiddleware = (...middlewares: Middleware[]) => {
  return (createStore: StoreFactory) => {
    return (reducer: Reducer) => {
      const store = createStore(reducer);
      const oldDispatch = store.dispatch;
      store.dispatch = middlewares.reduceRight((previous, current) => current(store)(previous), oldDispatch);
 
      return store;
    };
  };
};