import { Text } from "../Common/Text";
import { View } from "../Themed";

interface StatsProps {
  amount: string;
  count: number;
  pending: number;
}

const Stats = (props: StatsProps): JSX.Element => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 15,
      }}
    >
      <Text text70>Todays Orders: {props.count.toString()}</Text>
      <Text text50>Total Amount: Rs. {props.amount.toString()}</Text>
    </View>
  );
};

export default Stats;
