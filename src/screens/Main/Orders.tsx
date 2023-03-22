import {useQuery} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FETCH_ORDERS, GET_NEW_ORDER} from '../../apollo/graphql/Store/orders';
import Screen from '../../components/Common/Screen';
import OrderCard, {OrderProps} from '../../components/Store/OrderCard';
import TabHeader from '../../components/Store/TabHeader';
import {View} from '../../components/Themed';
import {setOrders} from '../../context/Store/actions';

import {RootStackScreenProps} from '../../../types';

export default function Orders({navigation}: RootStackScreenProps<'Root'>) {
  const dispatch: any = useDispatch();

  const [render, setRender] = useState(false);

  const {user} = useSelector((state: any) => state.userReducer);
  const {userOrders} = useSelector((state: any) => state.ordersReducer);

  const {
    loading: fetchingOrders,
    refetch,
    subscribeToMore,
  } = useQuery(FETCH_ORDERS, {
    variables: {
      limit: 20,
      offset: 0,
    },
    onCompleted(data) {
      if (data.getOrders) {
        dispatch(setOrders(data.getOrders));
      }
    },
    onError(error) {
      console.log({...error});
      Alert.prompt(
        'Error Occurred',
        'Failed to fetch orders, try again in some time.',
      );
    },
  });

  useEffect(() => {
    subscribeToMore({
      document: GET_NEW_ORDER,
      variables: {id: user?.id},
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;
        const updatedQueryData = subscriptionData.data.orderUpdate;

        const index = prev.getOrders.findIndex(
          (e: any) => e.id === updatedQueryData.id,
        );

        if (index <= -1) {
          dispatch(setOrders([updatedQueryData, ...prev.getOrders]));
          setRender(!render);
          return Object.assign({}, prev, {
            getOrders: [updatedQueryData, ...prev.getOrders],
          });
        } else {
          var updatedOrders = [...prev.getOrders];
          updatedOrders.splice(index, 1);
          dispatch(setOrders([updatedQueryData, ...updatedOrders]));
          setRender(!render);
          return Object.assign({}, prev, {
            getOrders: [updatedQueryData, ...updatedOrders],
          });
        }
      },
    });
  }, []);

  return (
    <Screen>
      <TabHeader
        icon="reload1"
        name="Orders"
        logo={false}
        iconPress={() => refetch()}
        namePress={() => {}}
      />
      {/* <View style={{ width: "100%", marginBottom: 15 }}>
        <ScrollView horizontal>
          <Button
            label="Today's Orders"
            size={Button.sizes.medium}
            outline={false}
            style={{ marginRight: 10 }}
          />
          <Button
            label="Pending"
            size={Button.sizes.medium}
            outline
            style={{ marginRight: 10 }}
          />
          <Button
            label="Delivered"
            size={Button.sizes.medium}
            outline
            style={{ marginRight: 10 }}
          />
        </ScrollView>
      </View> */}
      <View flex>
        <FlatList
          data={userOrders}
          extraData={userOrders}
          refreshing={fetchingOrders}
          onRefresh={() => refetch()}
          keyExtractor={(item: OrderProps) => item.id.toString()}
          renderItem={({item}) => (
            <OrderCard
              onPress={() =>
                navigation.navigate('OrderDetails', {
                  id: item.id,
                })
              }
              id={'loc' + item.id.slice(15, -1)}
              products={item.products}
              state={item.state}
              loading={false}
              screen={false}
            />
          )}
        />
      </View>
    </Screen>
  );
}
