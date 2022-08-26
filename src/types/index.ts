export type Action = {
  payload: unknown,
  type: string
};

export type Dispatch = (action: Action) => Action;

export type Middleware = (store: Store) => any;

export type Reducer<S = any, A = Action> = (
  state: S | undefined,
  action: A
) => S;

export type Reducers<S = any, A = Action> = {
  [K in keyof S]: Reducer<S[K], A>
}

export type Store = {
  subscribe(fn: Subscriber): (() => Subscriber),
  dispatch: Dispatch,
  getState: () => unknown
};

export type StoreFactory = (reducer: Reducer, middleware?: Function) => Store;

export type Subscriber = (...args: unknown[]) => void;