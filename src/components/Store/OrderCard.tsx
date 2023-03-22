import { formatDistanceToNow, parseISO } from "date-fns";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { Colors } from "react-native-ui-lib";

import { View } from "../Themed";
import { Section } from "../Common/Section";
import { BoldText, Text } from "../Common/Text";
import Image from "../Common/Image";
import History from "./Timeline";
import Tracker from "./Tracker";

import Sizes from "../../constants/Sizes";

export interface ProductProps {
  id: string;
  name: string;
  quantity: {
    units: number;
    count: string;
    type: string;
  };
  url: string;
  totalAmount: string;
}

export interface OrderProps {
  id: string;
  linkedAccount?: string;
  state: {
    cancelled: boolean;
    order: {
      cancelled: boolean;
      accepted: boolean;
      date: string;
    };
    delivery: {
      delivered: boolean;
      deliverBy: string;
      address: AddressProps;
    };
    payment: {
      grandAmount: string;
      paid: boolean;
    };
  };
  products: Array<ProductProps>;
  loading: boolean;
  onPress?: any;
  screen?: boolean;
  onBack?: any;
}

export interface AddressProps {
  line: string;
  location: {
    coordinates: [string, string];
  };
}

interface GrandTotalDeliveryProps {
  address: AddressProps;
  grandTotal: string;
  card?: boolean;
}

interface ProductListProps {
  card: boolean;
  products: Array<ProductProps>;
}

const ProductList = (props: ProductListProps): JSX.Element => {
  return (
    <FlatList
      data={props.products}
      ItemSeparatorComponent={() => (
        <View style={{ height: props.card ? 5 : 10 }} />
      )}
      keyExtractor={(item) => item.url}
      style={{ width: "100%" }}
      renderItem={({ item }) => (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "60%",
            }}
          >
            {!props.card && (
              <View style={{ marginRight: 10 }}>
                <Image og={true} dimension={40} url={item.url} />
              </View>
            )}
            <Text
              style={{
                fontSize: props.card ? Sizes.font.text : 16,
                width: "90%",
              }}
              numberOfLines={props.card ? 1 : 2}
            >
              {item.name}
            </Text>
          </View>
          <View
            style={{
              width: "35%",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: props.card ? Sizes.font.text : 16,
              }}
            >
              x{item.quantity.units.toString()}
            </Text>
            <Text
              style={{
                fontSize: props.card ? Sizes.font.text : 16,
              }}
            >
              Rs. {item.totalAmount}/-
            </Text>
          </View>
        </View>
      )}
    />
  );
};

export const GrandTotalDeliveryCard = (
  props: GrandTotalDeliveryProps
): JSX.Element => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        borderRadius: 10,
        padding: 5,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            width: "70%",
          }}
        >
          <BoldText>Address</BoldText>
          <Text numberOfLines={2}>{props.address.line}</Text>
        </View>
        <View
          style={{
            height: "80%",
            width: 2,
            backgroundColor: Colors.$backgroundDisabled,
            marginRight: 10,
          }}
        />
      </View>

      <View
        style={{
          width: "30%",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <BoldText>Grand Total</BoldText>
        <Text>Rs. {props.grandTotal}/-</Text>
      </View>
    </View>
  );
};

function OrderCard(props: OrderProps) {
  if (props.screen) {
    return (
      <View flex>
        {!props.state.delivery.delivered && (
          <Tracker deliverBy={props.state.delivery.deliverBy} />
        )}
        <Section
          title="Address"
          body={
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {props.state.delivery.address.line}
            </Text>
          }
        />
        <Section
          title="Products"
          body={
            <View marginT-5>
              <ProductList products={props.products} card={false} />
            </View>
          }
        />

        <Section
          title="Payment"
          body={
            <View style={{ flexDirection: "column" }}>
              <View
                row
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                  }}
                >
                  Grand Total{" "}
                </Text>
                <View
                  style={{
                    width: "40%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    —
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    Rs. {props.state.payment.grandAmount}/-
                  </Text>
                </View>
              </View>
              <View
                row
                style={{
                  width: "100%",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                  }}
                >
                  Payment Status{" "}
                </Text>
                <View
                  style={{
                    width: "40%",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    —
                  </Text>
                  <BoldText
                    style={{
                      fontSize: 16,
                    }}
                  >
                    {props.state.payment.paid ? "Paid" : "Unpaid"}
                  </BoldText>
                </View>
              </View>
            </View>
          }
        />
        <Section
          title="Timeline"
          body={
            <View marginT-5>
              <History
                delivery={props.state.delivery}
                order={props.state.order}
              />
            </View>
          }
        />
      </View>
    );
  }

  if (props.state.order.cancelled) {
    return (
      <View
        style={{
          width: "100%",
          padding: 5,
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderColor: Colors.$textDisabled,
        }}
      >
        <Text>Id: {props.id}</Text>
        <BoldText red50>cancelled</BoldText>
      </View>
    );
  }

  if (props.loading) {
    return (
      <View
        style={{
          minHeight: 185,
          width: "100%",
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 10,
          overflow: "hidden",
          flexDirection: "column",
          borderColor: Colors.$textDisabled,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View row center>
          <ActivityIndicator color={Colors.primary} size="large" />
          <BoldText marginL-20 text70 style={{ color: Colors.$iconPrimary }}>
            Please Wait ...
          </BoldText>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={{
        minHeight: 140,
        width: "100%",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        overflow: "hidden",
        flexDirection: "column",
        borderColor: Colors.$textDisabled,
      }}
      // disabled={!props.state.order.accepted}
      activeOpacity={0.6}
      onPress={props.onPress}
    >
      <View
        style={{
          width: "100%",
          padding: 5,
          borderBottomWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomColor: Colors.$textDisabled,
        }}
      >
        <Text>Id: {props.id}</Text>
        <BoldText>
          {formatDistanceToNow(parseISO(props.state.delivery.deliverBy))} to go
        </BoldText>
      </View>
      <View
        style={{
          padding: 5,
          flexDirection: "column",
          alignItems: "flex-start",
          borderBottomWidth: 1,
          borderBottomColor: Colors.$textDisabled,
        }}
      >
        <BoldText>Product{props.products.length > 0 && "s"}</BoldText>
        <ProductList card={true} products={props.products} />
      </View>
      <GrandTotalDeliveryCard
        address={props.state.delivery.address}
        grandTotal={props.state.payment.grandAmount}
      />
    </TouchableOpacity>
  );
}

export default OrderCard;
