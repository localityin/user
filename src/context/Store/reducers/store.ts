import { SET_STORE } from "../actions";

var storeState = {
  store: null,
};

export function storeReducer(state = storeState, action: any) {
  switch (action.type) {
    case SET_STORE:
      return { ...state, store: action.payload };
    default:
      return state;
  }
}
