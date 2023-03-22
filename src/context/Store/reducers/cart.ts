import { ADD_CART_ITEM, REMOVE_CART_ITEM, EMPTY_CART } from "../actions";

export interface CartProductProps {
  id: string;
  name: string;
  url: string;
  quantity: {
    units: number;
    count: string;
    type: string;
  };
  price: {
    mrp: string;
  };
  totalAmount: string;
}

var cartState: {
  cart: Array<CartProductProps>;
} = {
  cart: [],
};

function operate(
  item: CartProductProps,
  cart: Array<CartProductProps>,
  add: boolean
) {
  let arr = [...cart];
  let i: number = arr.findIndex((p) => p.id === item.id);

  if (i <= -1) {
    if (add) {
      arr.push({
        ...item,
        quantity: { ...item.quantity, units: 1 },
        totalAmount: item.price.mrp,
      });
    }
  } else {
    if (add) {
      let units = cart[i].quantity.units + 1;
      arr[i] = {
        ...cart[i],
        quantity: { ...cart[i].quantity, units: cart[i].quantity.units + 1 },
        totalAmount: (units * parseFloat(item.price.mrp)).toString(),
      };
    } else {
      let units = cart[i].quantity.units - 1;
      if (units <= 0) {
        arr.splice(i, 1);
      } else {
        arr[i] = {
          ...cart[i],
          quantity: { ...cart[i].quantity, units: units },
          totalAmount: (
            item.quantity.units * parseFloat(item.price.mrp)
          ).toString(),
        };
      }
    }
  }
  return arr;
}

export function cartReducer(state: any = cartState, action: any) {
  switch (action.type) {
    case ADD_CART_ITEM:
      const n = operate(action.payload, state.cart, true);
      return { ...state, cart: n };
    case REMOVE_CART_ITEM:
      const m = operate(action.payload, state.cart, false);
      return { ...state, cart: m };
    case EMPTY_CART:
      return { ...state, cart: [] };
    default:
      return state;
  }
}
