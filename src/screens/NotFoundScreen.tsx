import React from "react";

import { BoldText } from "../components/Common/Text";
import { View } from "../components/Themed";

import { RootStackScreenProps } from "../types";

const NotFoundScreen = ({ navigation }: RootStackScreenProps<"NotFound">) => {
  setTimeout(() => {
    navigation.navigate("Root");
  }, 2000);
  return (
    <View flex center>
      <BoldText text70>This screen doesn't exist. Redirecting you...</BoldText>
    </View>
  );
};

export default NotFoundScreen;
