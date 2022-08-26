"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.unknownAction = exports.addTodo = void 0;
const actionTypes_1 = require("./actionTypes");
function addTodo(payload) {
    return { type: actionTypes_1.ADD_TODO, payload };
}
exports.addTodo = addTodo;
function unknownAction() {
    return {
        type: actionTypes_1.UNKNOWN_ACTION,
        payload: null
    };
}
exports.unknownAction = unknownAction;
function throwError() {
    return {
        type: actionTypes_1.THROW_ERROR,
        payload: null
    };
}
exports.throwError = throwError;
/*
export function dispatchInMiddle(boundDispatchFn: () => void): Action {
  return {
    type: DISPATCH_IN_MIDDLE,
    boundDispatchFn
  }
}

export function getStateInMiddle(boundGetStateFn: () => void): Action {
  return {
    type: GET_STATE_IN_MIDDLE,
    boundGetStateFn
  }
}

export function subscribeInMiddle(boundSubscribeFn: () => void): Action {
  return {
    type: SUBSCRIBE_IN_MIDDLE,
    boundSubscribeFn
  }
}

export function unsubscribeInMiddle(boundUnsubscribeFn: () => void): Action {
  return {
    type: UNSUBSCRIBE_IN_MIDDLE,
    boundUnsubscribeFn
  }
}

export function throwError(): Action {
  return {
    type: THROW_ERROR
  }
}
*/ 
