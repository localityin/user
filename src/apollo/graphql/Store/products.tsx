import { gql } from "@apollo/client";

export const SEARCH_PRODUCTS = gql`
  query GetProductsFromStore($name: String!, $storeId: String!, $limit: Int!) {
    getProductsFromStore(name: $name, storeId: $storeId, limit: $limit) {
      products {
        id
        url
        name
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

export const SEARCH_PRODUCTS_NAME = gql`
  query GetProductsFromStore($name: String!, $storeId: String!, $limit: Int!) {
    getProductsFromStore(name: $name, storeId: $storeId, limit: $limit) {
      products {
        id
        name
      }
    }
  }
`;
