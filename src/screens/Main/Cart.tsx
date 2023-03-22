import React from 'react';
import {FlatList, StatusBar} from 'react-native';
import {Button, Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';

import Image from '../../components/Common/Image';
import Screen from '../../components/Common/Screen';
import {BoldText, Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';
import CartCounter from '../../components/Store/CartCounter';
import TabHeader from '../../components/Store/TabHeader';

import {emptyCart} from '../../context/Store/actions';

import {RootTabScreenProps} from '../../../types';

export default function Cart({navigation}: RootTabScreenProps<'Cart'>) {
  const {cart} = useSelector((state: any) => state.cartReducer);
  const {id} = useSelector((state: any) => state.deliveryReducer);
  const {feed} = useSelector((state: any) => state.feedReducer);

  const dispatch: any = useDispatch();

  if (!feed?.store.available) {
    return (
      <View center flex style={{paddingTop: StatusBar.currentHeight + 50}}>
        <View flex width-50 center>
          <BoldText center text70>
            There seems to be no stores nearby, change delivery location and try
            again in some time!
          </BoldText>
        </View>
      </View>
    );
  }

  return (
    <Screen>
      <TabHeader
        icon="delete"
        name="Cart"
        logo={false}
        color={cart?.length > 0 ? Colors.$textDanger : Colors.$textDisabled}
        iconPress={() => dispatch(emptyCart())}
        namePress={() => {}}
      />
      <View flex>
        {cart?.length > 0 ? (
          <FlatList
            data={cart}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginVertical: 15,
                  height: 1,
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: Colors.$backgroundDisabled,
                }}
              />
            )}
            keyExtractor={(e: any) => e.id.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image og={true} url={item.url} dimension={80} />
                  <View
                    style={{
                      width: '60%',
                      flexDirection: 'column',
                      marginLeft: 10,
                    }}>
                    <Text text70 numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text>
                      {item.quantity.units} x {item.quantity.count}
                      {item.quantity.type}
                    </Text>
                  </View>
                </View>
                <CartCounter item={item} />
              </View>
            )}
          />
        ) : (
          <View flex center>
            <View width-50 centerH>
              <BoldText center text70>
                Oops your cart is empty!
              </BoldText>
              <Button
                label={'Search Products'}
                disabled={false}
                size={Button.sizes.large}
                backgroundColor={Colors.$backgroundDarkActive}
                color={Colors.white}
                disabledBackgroundColor={Colors.$iconDisabled}
                round={false}
                marginT-10
                borderRadius={10}
                onPress={() => navigation.navigate('Search')}
              />
            </View>
          </View>
        )}
      </View>
      {cart?.length > 0 && (
        <Button
          label={id ? 'Confirm' : 'Add Address'}
          disabled={false}
          size={Button.sizes.large}
          color={Colors.white}
          backgroundColor={Colors.primary}
          disabledBackgroundColor={Colors.$iconDisabled}
          round={false}
          borderRadius={10}
          marginT-10
          marginB-10
          onPress={() =>
            id
              ? navigation.navigate('Confirm')
              : navigation.navigate('SetAddress', {
                  onNextRoute: 'Confirm',
                  set: false,
                  backDisabled: false,
                })
          }
        />
      )}
    </Screen>
  );
}
