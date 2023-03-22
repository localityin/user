import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { userReducer } from "./Common/reducers/user";
import { locationReducer } from "./Common/reducers/location";

import { cartReducer } from "./Store/reducers/cart";
import { ordersReducer } from "./Store/reducers/orders";
import { storeReducer } from "./Store/reducers/store";
import { feedReducer } from "./Store/reducers/feed";
import { accountsReducer } from "./Store/reducers/accounts";
import { deliveryReducer } from "./Store/reducers/delivery";

const rootReducer = combineReducers({
  userReducer,
  locationReducer,
  cartReducer,
  storeReducer,
  feedReducer,
  ordersReducer,
  deliveryReducer,
  accountsReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
