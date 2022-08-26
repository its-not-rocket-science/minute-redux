"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = void 0;
const applyMiddleware = (...middlewares) => {
    return (createStore) => {
        return (reducer) => {
            const store = createStore(reducer);
            const oldDispatch = store.dispatch;
            store.dispatch = middlewares.reduceRight((previous, current) => current(store)(previous), oldDispatch);
            return store;
        };
    };
};
exports.applyMiddleware = applyMiddleware;
