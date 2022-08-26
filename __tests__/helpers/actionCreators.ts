import {
  ADD_TODO,
  DISPATCH_IN_MIDDLE,
  GET_STATE_IN_MIDDLE,
  SUBSCRIBE_IN_MIDDLE,
  UNSUBSCRIBE_IN_MIDDLE,
  THROW_ERROR,
  UNKNOWN_ACTION
} from './actionTypes'
import { Action, Dispatch } from '../../src'

export function addTodo(payload: string): Action {
  return { type: ADD_TODO, payload }
}

export function unknownAction(): Action {
  return {
    type: UNKNOWN_ACTION,
    payload: null
  }
}

export function throwError(): Action {
  return {
    type: THROW_ERROR,
    payload: null
  }
}

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