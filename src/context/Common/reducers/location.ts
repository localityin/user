import { SET_LOCATION } from "../actions";

var locationState = {
  location: null,
};

export function locationReducer(state: any = locationState, action: any) {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };
    default:
      return state;
  }
}
