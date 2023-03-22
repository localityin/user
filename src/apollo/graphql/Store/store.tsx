import { gql } from "@apollo/client";

export const GET_FEED = gql`
  query GetFeed($coordinates: [String]) {
    getFeed(coordinates: $coordinates) {
      store {
        id
        storeName
        lastUpdated
        available
      }
      alikeProducts {
        id
        name
        url
        price {
          mrp
        }
        quantity {
          count
          type
        }
      }
      recentProducts {
        id
        name
        url
        quantity {
          count
          type
        }
        price {
          mrp
        }
      }
    }
  }
`;

export const FETCH_CONFIRMATION = gql`
  query GetConfirmation($storeId: String!) {
    getConfirmation(storeId: $storeId) {
      name
      status {
        closed
      }
      account {
        amount
        closed
        date
      }
    }
  }
`;
