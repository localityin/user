import { SET_DELIVERY_ADDRESS, SET_BOOK } from "../actions";

var deliveryState = {
  id: null,
  addressInfo: {
    name: null,
    line1: null,
    location: {
      coordinates: null,
    },
  },
  book: [],
};

export function deliveryReducer(state = deliveryState, action: any) {
  switch (action.type) {
    case SET_DELIVERY_ADDRESS:
      return {
        ...state,
        id: action.payload.id,
        addressInfo: action.payload.addressInfo,
      };
    case SET_BOOK:
      return {
        ...state,
        book: action.payload,
      };
    default:
      return state;
  }
}
