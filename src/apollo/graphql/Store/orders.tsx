import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($orderInfo: OrderInfo) {
    createOrder(orderInfo: $orderInfo) {
      id
    }
  }
`;

export const GET_DELIVERY_TIMES = gql`
  query DeliveryTimes {
    getDeliveryTimes {
      type
      text
      n
      active
    }
  }
`;

export const FETCH_ORDERS = gql`
  query FetchOrders($limit: Int!, $offset: Int!) {
    getOrders(limit: $limit, offset: $offset) {
      id
      products {
        name
        url
        quantity {
          units
          count
          type
        }
        totalAmount
      }
      state {
        order {
          cancelled
          accepted
          date
        }
        delivery {
          delivered
          dispatched
          address {
            line
            location {
              coordinates
            }
          }
          deliverBy
          deliveredAt
          dispatchedAt
        }
        payment {
          paid
          grandAmount
        }
        created {
          date
        }
      }
    }
  }
`;

export const GET_NEW_ORDER = gql`
  subscription Subscription($id: String!) {
    orderUpdate(id: $id) {
      id
      products {
        name
        url
        quantity {
          units
          count
          type
        }
        totalAmount
      }
      state {
        order {
          cancelled
          accepted
          date
        }
        delivery {
          delivered
          dispatched
          address {
            line
            location {
              coordinates
            }
          }
          deliverBy
          deliveredAt
          dispatchedAt
        }
        payment {
          paid
          grandAmount
        }
        created {
          date
        }
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: String!) {
    getOrder(id: $id) {
      id
      products {
        name
        url

        quantity {
          units
          count
          type
        }
        totalAmount
      }
      state {
        order {
          cancelled
          accepted
          date
        }
        delivery {
          delivered
          dispatched
          address {
            line
            location {
              coordinates
            }
          }
          deliverBy
          deliveredAt
          dispatchedAt
        }
        payment {
          paid
          grandAmount
        }
        created {
          date
        }
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation AlterState($id: String!, $cancel: Boolean) {
    alterOrderState(id: $id, cancel: $cancel)
  }
`;
