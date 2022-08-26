"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineReducers = void 0;
const combineReducers = (reducers) => {
    const rootReducer = (state = {}, action) => {
        for (const key in reducers) {
            const reducer = reducers[key];
            if (reducer instanceof Function) {
                const subState = state[key];
                const nextState = reducer(subState, action);
                if (nextState === undefined) {
                    throw new Error(`When called with an action of type ${action ? action.type : 'null'}, the slice reducer for key ${key} returned undefined.`);
                }
                state[key] = nextState;
            }
        }
        return state;
    };
    return rootReducer;
};
exports.combineReducers = combineReducers;
