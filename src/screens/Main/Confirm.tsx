import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useMutation, useQuery} from '@apollo/client';
import {useDispatch, useSelector} from 'react-redux';

import Screen from '../../components/Common/Screen';
import Image from '../../components/Common/Image';
import {Header} from '../../components/Common/Header';
import {Section} from '../../components/Common/Section';
import {BoldText, Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';
import DeliveryTime from '../../components/Store/DeliveryTime';
import {AccountTile} from './Accounts';

import {emptyCart} from '../../context/Store/actions';

import {
  CREATE_ORDER,
  GET_DELIVERY_TIMES,
} from '../../apollo/graphql/Store/orders';
import {FETCH_CONFIRMATION} from '../../apollo/graphql/Store/store';
import {RootStackScreenProps} from '../../../types';

export default function Confirm({navigation}: RootStackScreenProps<'Confirm'>) {
  const dispatch: any = useDispatch();

  const [grandTotal, setGrandTotal] = useState<string>('0');

  const {cart} = useSelector((state: any) => state.cartReducer);

  const {id: addressId, addressInfo} = useSelector(
    (state: any) => state.deliveryReducer,
  );

  const {feed} = useSelector((state: any) => state.feedReducer);

  const [store, setStore] = useState<{
    name?: string | null;
    account?: {
      date: string;
      amount: string;
      closed: boolean;
      exists: boolean;
    };
    status?: any;
  }>({
    name: null,
    account: null,
    status: null,
  });

  const [confirmed, setConfirmed] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length <= 0) {
      navigation.navigate('Cart');
    } else {
      var total = 0;
      cart.forEach((e: any) => {
        total += parseFloat(e.price.mrp) * parseInt(e.quantity.units);
      });
      setProducts(cart);
      setGrandTotal(total.toString());
    }
  }, [cart]);

  const [createOrder, {loading}] = useMutation(CREATE_ORDER, {
    variables: {
      orderInfo: {
        products: [],
        addressId,
        storeId: feed.store.id || '',
        delivery: true,
        deliverBy: deliveryTime.n,
        accountId: accountId,
      },
    },
    onCompleted(data) {
      if (data.createOrder) {
        setConfirmed(true);
        dispatch(emptyCart());
        setTimeout(() => {
          navigation.navigate('Orders');
        }, 2000);
      }
    },
    onError(error) {
      console.log(products);
      console.log({
        orderInfo: {
          products: products,
          addressId,
          storeId: feed.store.id || '',
          delivery: true,
          deliverBy: deliveryTime.n,
          accountId: accountId,
        },
      });
      console.log(error);
      Alert.alert(
        'Error occured',
        'Order cannot be placed currently. Please try again later.',
      );
    },
  });

  function handleOrder() {
    const data = setTimeout(() => {
      createOrder({
        variables: {
          orderInfo: {
            products: products,
            addressId,
            storeId: feed.store.id || '',
            delivery: true,
            deliverBy: deliveryTime.n,
            accountId: accountId,
          },
        },
      });
    }, 2000);
    return data;
  }

  const {loading: fetchingStore, refetch} = useQuery(FETCH_CONFIRMATION, {
    variables: {
      storeId: feed.store.id,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.getConfirmation) {
        setStore(data.getConfirmation);
      }
    },
    onError(error) {
      console.log(feed);
      console.log({...error});
      Alert.alert(
        'Oops! Error Occured',
        "We couldn't fetch stores near you at the moment. Try again later.",
      );
    },
  });

  const {data: deliveryTimes} = useQuery(GET_DELIVERY_TIMES, {
    onCompleted(data) {
      setDeliveryTime(data?.getDeliveryTimes[1]);
    },
    onError(err) {
      console.log(err);
    },
  });

  function handleDeliveryTime(item: any) {
    setDeliveryTime(item);
  }

  useEffect(() => {
    refetch();
  }, [feed]);

  if (loading) {
    return (
      <View flex center>
        <ActivityIndicator
          size={'large'}
          color={Colors.primary}
          style={{marginBottom: 10}}
        />
        <BoldText $iconPrimary text70>
          Getting order confirmation
        </BoldText>
      </View>
    );
  }

  if (confirmed) {
    return (
      <View flex center>
        <ActivityIndicator
          size={'large'}
          color={Colors.primary}
          style={{marginBottom: 10}}
        />
        <BoldText $iconPrimary text70>
          Order Confirmed! Redirecting!
        </BoldText>
      </View>
    );
  }

  return (
    <Screen>
      <Header title="Confirm" onBack={() => navigation.navigate('Cart')} />
      <FlatList
        style={{flex: 1}}
        data={[1]}
        keyExtractor={e => e.toString()}
        renderItem={() => (
          <>
            <Section
              title="Products"
              body={
                <FlatList
                  data={cart}
                  keyExtractor={e => e.id.toString()}
                  ItemSeparatorComponent={() => <View marginV-5 />}
                  style={{
                    padding: 5,
                    paddingLeft: 10,
                    borderRadius: 5,
                  }}
                  renderItem={({item}) => (
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                      }}>
                      <Image url={item.url} dimension={50} og={true} />
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          backgroundColor: 'transparent',
                        }}>
                        <Text style={{width: '75%'}} text70 numberOfLines={2}>
                          {item.name}
                        </Text>
                      </View>
                      <Text text70>₹ {item.totalAmount}/-</Text>
                    </View>
                  )}
                />
              }
            />
            <Section
              title="Address &amp; Total"
              body={
                <View
                  row
                  centerH
                  style={{
                    height: 60,
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      backgroundColor: Colors.$iconPrimary + '22',
                    }}
                    onPress={() =>
                      navigation.navigate('SetAddress', {
                        backDisabled: false,
                        set: false,
                        onNextRoute: 'Confirm',
                      })
                    }>
                    <Text>
                      {addressId ? `${addressInfo.name}` : 'Add Address'}
                    </Text>
                    <Text text70 numberOfLines={1}>
                      {addressId
                        ? `${addressInfo.line1}`
                        : 'Click to add from address book'}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      borderRadius: 5,
                      backgroundColor: 'transparent',
                      marginLeft: 10,
                    }}>
                    <Text>Grand Total</Text>
                    <Text text70>₹ {grandTotal}/-</Text>
                  </View>
                </View>
              }
            />
            {fetchingStore ? (
              <>
                <BoldText text70>Store</BoldText>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <View
                    style={{
                      height: 42,
                      width: 42,
                      backgroundColor: Colors.$backgroundDisabled,
                      borderRadius: 5,
                    }}
                    center>
                    <ActivityIndicator
                      size="small"
                      color={Colors.$textDefault}
                    />
                  </View>
                </View>
              </>
            ) : store.name ? (
              <Section
                title="Store"
                body={
                  <>
                    <AccountTile
                      id=""
                      closed={true}
                      screen={true}
                      name={store.name || 'Store Name'}
                      lastUpdated={store.account.date}
                      pending={{
                        amount: store.account.amount,
                        status: store.account.closed,
                      }}
                      exists={store.account.exists}
                      onPress={() => {}}
                      disabled={false}
                    />
                  </>
                }
              />
            ) : (
              <View>
                <BoldText text70>Store</BoldText>
                <Text text70 marginB-15>
                  No stores active around selected delivery address at the
                  moment.
                </Text>
              </View>
            )}
            {store.name && (
              <Section
                title="Delivery Time"
                body={
                  <DeliveryTime
                    onPress={(item: any) => handleDeliveryTime(item)}
                    active={deliveryTime}
                    data={deliveryTimes?.getDeliveryTimes || []}
                  />
                }
              />
            )}
          </>
        )}
      />
      <View marginB-10 row centerH style={{justifyContent: 'space-between'}}>
        <TouchableOpacity
          style={{
            backgroundColor: store.name
              ? Colors.primary
              : Colors.$backgroundDisabled,
            padding: 10,
            borderRadius: 10,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={store.name ? false : true}
          onPress={() => handleOrder()}>
          <Text text70 style={{color: Colors.white}}>
            Confirm Order
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
