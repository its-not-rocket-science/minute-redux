import {
  ADD_TODO,
  DISPATCH_IN_MIDDLE,
  GET_STATE_IN_MIDDLE,
  SUBSCRIBE_IN_MIDDLE,
  UNSUBSCRIBE_IN_MIDDLE,
  THROW_ERROR
} from './actionTypes';

import { Action } from '../../src';

const id = (state: { id: number }[]) => {
  return (
    state.reduce((result, item) => (item.id > result ? item.id : result), 0) + 1
  )
};

export interface Todo {
  id: number
  text: string
}
export type TodoAction = { type: 'ADD_TODO'; payload: string } | Action;

export const todos = (state: Todo[] = [], action: TodoAction) => {
  switch (action.type) {
    case ADD_TODO:
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
