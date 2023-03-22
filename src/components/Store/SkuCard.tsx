import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import {
  Button,
  Colors,
  Constants,
  Dialog,
  PanningProvider,
  View,
} from "react-native-ui-lib";
import { useSelector } from "react-redux";

import { Text } from "../Common/Text";
import Image from "../Common/Image";
import CartCounter from "./CartCounter";

interface SkuCardProps {
  visible: boolean;
  setVisible: any;
  skus: Array<any>;
  setSkus: any;
}

export default function (props: SkuCardProps) {
  const navigation = useNavigation();

  const { cart } = useSelector((state: any) => state.cartReducer);

  return (
    <Dialog
      bottom={true}
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
        props.setSkus([]);
      }}
      panDirection={PanningProvider.Directions.DOWN}
      containerStyle={{
        backgroundColor: Colors.$backgroundDefault,
        marginBottom: Constants.isIphoneX ? 0 : 20,
        borderRadius: 12,
      }}
      ignoreBackgroundPress={false}
    >
      <View
        spread
        style={{
          height: props.skus.length * 65 + 130,
        }}
      >
        <View marginV-10 marginH-20 flex>
          <FlatList
            data={props.skus}
            keyExtractor={(e) => e.id}
            renderItem={({ item }) => (
              <View
                style={{
                  height: 80,
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image url={item.url} og={true} dimension={80} />
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginLeft: 15,
                    }}
                  >
                    <Text text70>Rs {item.price.mrp}/-</Text>
                    <Text text70>
                      {item.quantity.count} {item.quantity.type}
                    </Text>
                  </View>
                </View>
                <CartCounter item={item} />
              </View>
            )}
          />
        </View>
        <Button
          label={"Go to Cart"}
          disabled={cart.length <= 0}
          size={Button.sizes.large}
          backgroundColor={Colors.primary}
          disabledBackgroundColor={Colors.$iconDisabled}
          round={false}
          borderRadius={10}
          margin-20
          onPress={() => navigation.navigate("Cart")}
        />
      </View>
    </Dialog>
  );
}
