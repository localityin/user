import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useDispatch, useSelector} from 'react-redux';
import {Colors} from 'react-native-ui-lib';

import {View} from '../Themed';
import {Text} from '../Common/Text';

import Sizes from '../../constants/Sizes';

import {addCartItem, removeCartItem} from '../../context/Store/actions';

interface CartCounterProps {
  item: {
    id: string;
  };
  mini?: boolean;
}

export default function CartCounter(props: CartCounterProps) {
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
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: count > 0 ? 'transparent' : Colors.$iconPrimary,
      }}
      padding-10
      marginT-5>
      {count > 0 && (
        <>
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
        </>
      )}
      <TouchableOpacity onPress={() => dispatch(addCartItem(props.item))}>
        <AntDesign
          name="plus"
          size={Sizes.icon.normal}
          color={count > 0 ? Colors.primary : Colors.white}
        />
      </TouchableOpacity>
    </View>
  );
}
