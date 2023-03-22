import { gql } from "@apollo/client";

const USER_FRAGMENT = gql`
  fragment UserDetail on User {
    id
    name
    contact {
      ISD
      number
    }
    token
  }
`;

export const REGISTER_USER = gql`
  ${USER_FRAGMENT}
  mutation register($userInfoInput: UserInfoInput) {
    register(userInfoInput: $userInfoInput) {
      ...UserDetail
    }
  }
`;

export const LOGIN_USER = gql`
  ${USER_FRAGMENT}
  mutation login($contact: ContactInput!) {
    login(contact: $contact) {
      ...UserDetail
    }
  }
`;

export const UPDATE_USER = gql`
  subscription UpdateUser($id: String!) {
    userUpdate(id: $id) {
      id
      name
      contact {
        ISD
        number
      }
      deliveryAddresses {
        id
        name
        line1
        location {
          coordinates
        }
      }
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation Mutation($userInfoInput: UserInfoInput) {
    editProfile(userInfoInput: $userInfoInput)
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation Mutation($id: String, $addressInfo: UpdateAddress) {
    updateAddress(id: $id, addressInfo: $addressInfo)
  }
`;

export const FETCH_USER = gql`
  query GetUser {
    getUser {
      id
      name
      contact {
        ISD
        number
      }
      deliveryAddresses {
        id
        name
        line1
        location {
          coordinates
        }
      }
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: String!) {
    deleteAddress(id: $id)
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;
