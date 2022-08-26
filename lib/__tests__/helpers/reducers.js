"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todos = void 0;
const actionTypes_1 = require("./actionTypes");
const id = (state) => {
    return (state.reduce((result, item) => (item.id > result ? item.id : result), 0) + 1);
};
const todos = (state = [], action) => {
    switch (action.type) {
        case actionTypes_1.ADD_TODO:
            return [
                ...state,
                {
                    id: id(state),
                    text: action.payload
                }
            ];
        default:
            return state;
    }
};
exports.todos = todos;
