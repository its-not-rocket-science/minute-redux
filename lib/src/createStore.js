"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
const createStore = (reducer, middleware) => {
    if (middleware instanceof Function) {
        return middleware(exports.createStore)(reducer);
    }
    let state;
    const subscriptions = [];
    const store = {
        subscribe: (fn) => {
            subscriptions.push(fn);
            return () => subscriptions.splice(subscriptions.indexOf(fn), 1)[0];
        },
        dispatch: (action) => {
            state = reducer(state, action);
            subscriptions.forEach((fn) => fn());
            return action;
        },
        getState: () => state
    };
    store.dispatch({ payload: null, type: 'INITIALISE' });
    return store;
};
exports.createStore = createStore;
