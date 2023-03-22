import { SET_FEED } from "../actions";

var feedState = {
  feed: null,
};

export function feedReducer(state = feedState, action: any) {
  switch (action.type) {
    case SET_FEED:
      return { ...state, feed: action.payload };
    default:
      return state;
  }
}
