// all user
export const ADD_CART_ITEM = "ADD_CART_ITEM";
export const REMOVE_CART_ITEM = "REMOVE_CART_ITEM";
export const EMPTY_CART = "EMPTY_CART";

export const addCartItem = (item: any) => (dispatch: any) => {
  dispatch({
    type: ADD_CART_ITEM,
    payload: item,
  });
};

export const removeCartItem = (item: any) => (dispatch: any) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: item,
  });
};

export const emptyCart = () => (dispatch: any) => {
  dispatch({
    type: EMPTY_CART,
  });
};

// set store
export const SET_STORE = "SET_STORE";
export const EDIT_STORE = "EDIT_STORE";

export const setStore = (store: any) => (dispatch: any) => {
  dispatch({
    type: SET_STORE,
    payload: store,
  });
};

export const editStore = (store: any) => (dispatch: any) => {
  dispatch({
    type: EDIT_STORE,
    payload: store,
  });
};

// accounts
export const SET_RUNNING_ACCOUNTS = "SET_RUNNING_ACCOUNTS";
export const SET_ACCOUNTS_META = "SET_ACCOUNTS_META";

export const setRunningAccounts = (runningAccounts: any) => (dispatch: any) => {
  dispatch({
    type: SET_RUNNING_ACCOUNTS,
    payload: runningAccounts,
  });
};

export const setAccountsMeta = (meta: any) => (dispatch: any) => {
  dispatch({
    type: SET_ACCOUNTS_META,
    payload: meta,
  });
};

// set inventory
export const SET_INVENTORY = "SET_INVENTORY";

export const setInventory = (inventory: any) => (dispatch: any) => {
  dispatch({
    type: SET_INVENTORY,
    payload: inventory,
  });
};

// all user orders
export const SET_ORDERS = "SET_ORDERS";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ACCEPT_ORDER = "ACCEPT_ORDER";

export const setOrders = (orders: any) => (dispatch: any) => {
  dispatch({
    type: SET_ORDERS,
    payload: orders,
  });
};
export const acceptOrder = (order: any) => (dispatch: any) => {
  dispatch({
    type: ACCEPT_ORDER,
    payload: order,
  });
};
export const cancelOrder = (order: any) => (dispatch: any) => {
  dispatch({
    type: CANCEL_ORDER,
    payload: order,
  });
};

// delivery
export const SET_DELIVERY_ADDRESS = "SET_DELIVERY_ADDRESS";
export const setDeliveryAddress = (address: any) => (dispatch: any) => {
  dispatch({
    type: SET_DELIVERY_ADDRESS,
    payload: address,
  });
};

export const SET_BOOK = "SET_BOOK";
export const setBook = (list: any) => (dispatch: any) => {
  dispatch({
    type: SET_BOOK,
    payload: list,
  });
};

// feed
export const SET_FEED = "SET_FEED";
export const setFeed = (feed: any) => (dispatch: any) => {
  dispatch({
    type: SET_FEED,
    payload: feed,
  });
};
