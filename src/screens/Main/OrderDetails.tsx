import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import {CANCEL_ORDER, GET_ORDER} from '../../apollo/graphql/Store/orders';

import {Header} from '../../components/Common/Header';
import Screen from '../../components/Common/Screen';
import {BoldText} from '../../components/Common/Text';
import OrderCard, {OrderProps} from '../../components/Store/OrderCard';
import {View} from '../../components/Themed';

import {RootStackScreenProps} from '../../../types';

export default function OrderDetails({
  route,
  navigation,
}: RootStackScreenProps<'OrderDetails'>) {
  const {id} = route.params;

  const [order, setOrder] = useState<any>();
  const {userOrders} = useSelector((state: any) => state.ordersReducer);

  const [fetch, {loading}] = useLazyQuery(GET_ORDER, {
    variables: {
      id: id,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setOrder(data.getOrder);
    },
    onError(error) {
      console.log({...error});
    },
  });

  useEffect(() => {
    if (userOrders) {
      setOrder(userOrders.find((order: OrderProps) => order.id === id));
    }
  }, [userOrders]);

  const [cancelOrder, {loading: cancelling}] = useMutation(CANCEL_ORDER, {
    variables: {
      id: id,
      cancel: true,
    },
    onCompleted(data) {
      if (data.alterOrderState) {
        navigation.navigate('Orders');
      }
    },
    onError(error) {
      console.log({...error});
    },
  });

  if (order === undefined) {
    return (
      <View center flex>
        <ActivityIndicator size={'large'} color={Colors.$iconPrimary} />
        <BoldText text70>Fetching order details...</BoldText>
      </View>
    );
  }

  return (
    <Screen>
      <Header title="Detail" onBack={() => navigation.navigate('Orders')} />
      <FlatList
        style={{flex: 1}}
        data={[1]}
        renderItem={() => (
          <OrderCard
            onPress={() => {}}
            id={order.id}
            products={order.products}
            state={order.state}
            loading={loading}
            screen={true}
          />
        )}
      />
      {!order.state.delivery.dispatched && (
        <View
          style={{
            marginTop: 5,
            height: 50,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                'Confirm action',
                'Do you confirm that you want to cancel this order?',
                [
                  {
                    text: 'Back',
                    onPress: () => {},
                  },
                  {
                    text: 'Yes, I confirm',
                    onPress: () =>
                      cancelOrder({
                        variables: {
                          id: id,
                          cancel: true,
                        },
                      }),
                    style: 'destructive',
                  },
                ],
              )
            }
            style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.$iconDanger,
            }}
            disabled={cancelling}>
            {cancelling ? (
              <ActivityIndicator color={Colors.white} size={'large'} />
            ) : (
              <BoldText style={{color: Colors.white}}>Cancel Order</BoldText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </Screen>
  );
}
