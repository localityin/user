import { ACCEPT_ORDER, SET_ORDERS, CANCEL_ORDER } from "../actions";

var userOrderState = {
  userOrders: [],
  lastOrder: null,
};

export function ordersReducer(state: any = userOrderState, action: any) {
  switch (action.type) {
    case SET_ORDERS:
      return { ...state, userOrders: action.payload };
    case ACCEPT_ORDER:
      return { ...state, lastOrder: action.payload };
    case CANCEL_ORDER:
      return { ...state, lastOrder: action.payload };
    default:
      return state;
  }
}
