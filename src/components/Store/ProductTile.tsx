import AntDesign from 'react-native-vector-icons/AntDesign';
import {useEffect, useState, useMemo} from 'react';
import {Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {addCartItem, removeCartItem} from '../../context/Store/actions';
import Image from '../Common/Image';
import {BoldText, Text} from '../Common/Text';
import {View} from '../Themed';
import {ProductProps} from './OrderCard';
import Sizes from '../../constants/Sizes';

interface IFeedProductTile {
  item: ProductProps;
}

function FeedProductTile(props: IFeedProductTile) {
  const {cart} = useSelector((state: any) => state.cartReducer);
  const [count, setCount] = useState<number>(0);

  const dispatch: any = useDispatch();

  useEffect(() => {
    const itemCount =
      cart.find((e: any) => e.id === props.item.id)?.quantity.units || 0;
    setCount(itemCount);
  }, [cart]);

  return (
    <View
      style={{
        width: '47%',
        marginBottom: '8%',
        minHeight: 150,
        flexDirection: 'column',
        borderRadius: 5,

        borderColor: Colors.$backgroundDisabled + '66',
      }}>
      {/* <View
        style={{
          top: 0,
          left: 0,
          height: 30,
          padding: 5,
          zIndex: 999,
          borderRadius: 5,
          position: "absolute",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.$iconPrimary,
        }}
      >
        <MaterialCommunityIcons
          color={Colors.white}
          style={{ marginRight: 5 }}
          name="chart-line"
        />
        <Text style={{ color: Colors.white }}>Popular</Text>
      </View> */}
      <View style={{width: '100%', height: 90}} center>
        <Image url={props.item.url} dimension={90} og={true} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <View flex>
          <BoldText text80 numberOfLines={2} style={{height: 45}}>
            {props.item.name}
          </BoldText>
          <Text grey10>
            {props.item.quantity.count}
            {props.item.quantity.type}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}>
            <Text text70>₹ {props.item.price.mrp}</Text>
            <TouchableOpacity
              style={{
                height: 40,
                width: 80,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: count > 0 ? Colors.primary : Colors.grey40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              disabled={count > 0}
              onPress={() => dispatch(addCartItem(props.item))}>
              {count > 0 ? (
                <View row center>
                  <TouchableOpacity
                    onPress={() => dispatch(removeCartItem(props.item))}>
                    <AntDesign
                      name="minus"
                      size={Sizes.icon.normal}
                      color={Colors.text}
                    />
                  </TouchableOpacity>
                  <Text marginH-10 text70>
                    {count.toString()}
                  </Text>

                  <TouchableOpacity
                    onPress={() => dispatch(addCartItem(props.item))}>
                    <AntDesign
                      name="plus"
                      size={Sizes.icon.normal}
                      color={count > 0 ? Colors.primary : Colors.white}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <BoldText text70 style={{color: Colors.primary}}>
                  Add
                </BoldText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default FeedProductTile;
