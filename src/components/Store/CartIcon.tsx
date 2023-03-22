import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, TouchableOpacity} from 'react-native-ui-lib';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {Text} from '../Common/Text';
import {View} from '../Themed';

import Sizes from '../../constants/Sizes';

interface ICartIcon {
  show?: boolean;
}

export default function CartIcon(props: ICartIcon) {
  const {cart} = useSelector((state: any) => state.cartReducer);
  const navigation = useNavigation();

  if (cart === undefined) {
    return null;
  }

  if (cart?.length <= 0) {
    return props.show ? (
      <AntDesign
        name="shoppingcart"
        color={Colors.$iconNeutral}
        size={Sizes.icon.header}
        style={{marginBottom: -3}}
      />
    ) : null;
  }

  return (
    <TouchableOpacity
      marginL-5
      marginB-5
      onPress={() => navigation.navigate('Cart')}>
      <AntDesign
        name="shoppingcart"
        color={Colors.primary}
        size={Sizes.icon.header}
        style={{marginHorizontal: 10, marginTop: 10}}
      />
      {cart?.length > 0 && (
        <View
          style={{
            backgroundColor: Colors.primary,
            padding: 2,
            paddingHorizontal: 5,
            borderRadius: 5,
            position: 'absolute',
            top: 0,
            right: 0,
          }}>
          <Text
            style={{
              fontSize: Sizes.font.small,
              color: Colors.white,
            }}>
            {cart?.length.toString() || 0}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
