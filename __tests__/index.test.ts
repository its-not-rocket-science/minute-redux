import {
  Action,
  applyMiddleware,
  combineReducers,
  createStore,
  Dispatch,
  Middleware,
  Reducer,
  Store,
} from "../src";
import { addTodo, throwError, unknownAction } from "./helpers/actionCreators";
import * as reducers from "./helpers/reducers";
import * as ActionTypes from "./helpers/actionTypes";

describe("createStore", () => {
  it("exposes the public API", () => {
    const store = createStore(combineReducers(reducers));
    const methods = Object.keys(store);

    expect(methods.length).toBe(3);
    expect(methods).toContain("subscribe");
    expect(methods).toContain("dispatch");
    expect(methods).toContain("getState");
  });

  it("throws if reducer is not a function", () => {
    // @ts-expect-error
    expect(() => createStore(undefined)).toThrow();
    // @ts-expect-error
    expect(() => createStore("test")).toThrow();
    // @ts-expect-error
    expect(() => createStore({})).toThrow();

    expect(() => createStore(() => {})).not.toThrow();
  });

  it("applies the reducer to the previous state", () => {
    const store = createStore(reducers.todos);
    expect(store.getState()).toEqual([]);

    store.dispatch(unknownAction());
    expect(store.getState()).toEqual([]);

    store.dispatch(addTodo("Hello"));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: "Hello",
      },
    ]);

    store.dispatch(addTodo("World"));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: "Hello",
      },
      {
        id: 2,
        text: "World",
      },
    ]);
  });

  it("supports multiple subscriptions", () => {
    const store = createStore(reducers.todos);
    const listenerA = jest.fn();
    const listenerB = jest.fn();

    let unsubscribeA = store.subscribe(listenerA);
    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(0);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(2);
    expect(listenerB.mock.calls.length).toBe(0);

    const unsubscribeB = store.subscribe(listenerB);
    expect(listenerA.mock.calls.length).toBe(2);
    expect(listenerB.mock.calls.length).toBe(0);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(1);

    unsubscribeA();
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(1);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    unsubscribeB();
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    unsubscribeA = store.subscribe(listenerA);
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(4);
    expect(listenerB.mock.calls.length).toBe(2);
  });
});

const loggerMiddleware1: Middleware = (store) => {
  const getState = store.getState;
  return (dispatch: Dispatch) => {
    return (action: Action) => {
      //console.log('LOGGER1 action', action);
      const newVal = dispatch(action);
      //console.log('LOGGER1 new value', newVal);
      //console.log('LOGGER1 new state', getState());
      return newVal;
    };
  };
};

const loggerMiddleware2: Middleware = (store) => {
  const getState = store.getState;
  return (dispatch: Dispatch) => {
    return (action: Action) => {
      //console.log('LOGGER2 action', action);
      const newVal = dispatch(action);
      //console.log('LOGGER2 new value', newVal);
      //console.log('LOGGER2 new state', getState());
      return newVal;
    };
  };
};

describe("applyMiddleware", () => {
  it("wraps dispatch method with middleware once", () => {
    function test(spyOnMethods: any) {
      return (methods: any) => {
        spyOnMethods(methods);
        return (next: Dispatch) => (action: Action) => next(action);
      };
    }

    const spy = jest.fn();
    const store = applyMiddleware(test(spy), loggerMiddleware1)(createStore)(
      reducers.todos
    );

    store.dispatch(addTodo("Use Redux"));
    store.dispatch(addTodo("Flux FTW!"));

    expect(spy.mock.calls.length).toEqual(1);

    expect(spy.mock.calls[0][0]).toHaveProperty("getState");
    expect(spy.mock.calls[0][0]).toHaveProperty("dispatch");

    expect(store.getState()).toEqual([
      { id: 1, text: "Use Redux" },
      { id: 2, text: "Flux FTW!" },
    ]);
  });

  it("passes recursive dispatches through the middleware chain", () => {
    function test(spyOnMethods: any) {
      return () => (next: Dispatch) => (action: Action) => {
        spyOnMethods(action);
        return next(action);
      };
    }

    const spy = jest.fn();
    const store = applyMiddleware(test(spy), loggerMiddleware1)(createStore)(
      reducers.todos
    );

    const dispatchAction = store.dispatch(addTodo("Use Redux"));

    expect(spy.mock.calls.length).toEqual(1);
  });

  it("works with thunk middleware", (done) => {
    const store = applyMiddleware(loggerMiddleware1)(createStore)(
      reducers.todos
    );

    store.dispatch(addTodo("Hello") as any);
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: "Hello",
      },
    ]);

    store.dispatch(addTodo("World"));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: "Hello",
      },
      {
        id: 2,
        text: "World",
      },
    ]);

    // the typing for redux-thunk is super complex, so we will use an "as unknown" hack
    store.dispatch(addTodo("Maybe"));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: "Hello",
      },
      {
        id: 2,
        text: "World",
      },
      {
        id: 3,
        text: "Maybe",
      },
    ]);
    done();
  });
});

describe("combineReducers", () => {
  it("returns a composite reducer that maps the state keys to given reducers", () => {
    const reducer = combineReducers({
      counter: (state: number = 0, action) =>
        action.type === "increment" ? state + 1 : state,
      stack: (state: any[] = [], action) =>
        action.type === "push" ? [...state, action.payload] : state,
    });

    const s1 = reducer(undefined, { type: "increment", payload: null });
    expect(s1).toEqual({ counter: 1, stack: [] });
    const s2 = reducer(s1, { type: "push", payload: "a" });
    expect(s2).toEqual({ counter: 1, stack: ["a"] });
  });

  it("ignores all props which are not a function", () => {
    // we double-cast because these conditions can only happen in a javascript setting
    const reducer = combineReducers({
      fake: true as unknown as Reducer,
      broken: "string" as unknown as Reducer,
      another: { nested: "object" } as unknown as Reducer,
      stack: (state = []) => state,
    });

    expect(
      Object.keys(reducer(undefined, { type: "push", payload: null }))
    ).toEqual(["stack"]);
  });

  it("throws an error if a reducer returns undefined handling an action", () => {
    const reducer = combineReducers({
      counter(state: number = 0, action) {
        switch (action && action.type) {
          case "increment":
            return state + 1;
          case "decrement":
            return state - 1;
          case "whatever":
          case null:
          case undefined:
            return undefined;
          default:
            return state;
        }
      },
    });

    expect(() =>
      reducer({ counter: 0 }, { type: "whatever", payload: null })
    ).toThrow(
      "When called with an action of type whatever, the slice reducer for key counter returned undefined."
    );
    // @ts-expect-error
    expect(() => reducer({ counter: 0 }, null)).toThrow(
      "When called with an action of type null, the slice reducer for key counter returned undefined."
    );
    expect(() => reducer({ counter: 0 }, {} as unknown as Action)).toThrow(
      "When called with an action of type undefined, the slice reducer for key counter returned undefined."
    );
  });

  it("catches error thrown in reducer when initializing and re-throw", () => {
    const reducer = combineReducers({
      throwingReducer() {
        throw new Error("Error thrown in reducer");
      },
    });
    expect(() => reducer(undefined, undefined as unknown as Action)).toThrow(
      /Error thrown in reducer/
    );
  });

  it("maintains referential equality if the reducers it is combining do", () => {
    const reducer = combineReducers({
      child1(state = {}) {
        return state;
      },
      child2(state = {}) {
        return state;
      },
      child3(state = {}) {
        return state;
      },
    });

    const initialState = reducer(undefined, { type: "@@INIT", payload: null });
    expect(reducer(initialState, { type: "FOO", payload: null })).toBe(
      initialState
    );
  });
});
