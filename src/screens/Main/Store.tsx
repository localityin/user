import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, PermissionsAndroid} from 'react-native';
import {Button, Colors} from 'react-native-ui-lib';
import {useLazyQuery, useQuery} from '@apollo/client';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import Screen from '../../components/Common/Screen';
import TabHeader from '../../components/Store/TabHeader';
import Feed from '../../components/Store/Feed';

import {RootTabScreenProps} from '../../../types';
import {View} from '../../components/Themed';
import {BoldText} from '../../components/Common/Text';

import {GET_FEED} from '../../apollo/graphql/Store/store';
import {FETCH_USER, UPDATE_USER} from '../../apollo/graphql/Common/user';

import {setDeliveryAddress, setFeed} from '../../context/Store/actions';
import {setUser} from '../../context/Common/actions';

export default function Store({navigation}: RootTabScreenProps<'Store'>) {
  const [permission, setPermission] = useState<string | null>(null);

  const dispatch: any = useDispatch();

  const {id, addressInfo} = useSelector((state: any) => state.deliveryReducer);
  const {feed} = useSelector((state: any) => state.feedReducer);
  const {user} = useSelector((state: any) => state.userReducer);

  const [getFeed, {loading: fetchingFeed}] = useLazyQuery(GET_FEED, {
    variables: {
      coordinates: addressInfo.location,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.getFeed) {
        dispatch(setFeed(data.getFeed));
      }
    },
    onError(error) {
      // console.log({ ...error });
    },
  });

  const {loading: fetchingUser, subscribeToMore} = useQuery(FETCH_USER, {
    onCompleted(data) {
      if (data.getUser.deliveryAddresses.length === 0) {
        navigation.navigate('SetAddress', {
          set: true,
          backDisabled: true,
          onNextRoute: 'Root',
        });
      } else {
        let ad = data.getUser.deliveryAddresses[0];
        dispatch(
          setDeliveryAddress({
            id: ad.id,
            addressInfo: {
              name: ad.name,
              line1: ad.line1,
              location: ad.location,
            },
          }),
        );
      }
      dispatch(setUser(data.getUser, false));
    },
    onError(error) {
      console.log(error);
      Alert.alert(
        'Error occurred',
        'We are facing some issues fetching address book.',
      );
    },
  });

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToMore({
        document: UPDATE_USER,
        variables: {id: user?.id},
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) return prev;
          const updatedQueryData = subscriptionData.data.userUpdate;
          dispatch(setUser(updatedQueryData, false));
          return Object.assign({}, prev, {
            getUser: updatedQueryData,
          });
        },
      });
      return unsubscribe;
    }
  }, [user]);

  const askForLocationPermission = () => {
    (async () => {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Locality Location permission',
          message:
            'Locality App needs to access precise location to fetch stores nearest to you.',
          buttonPositive: 'Allow access',
          buttonNegative: 'Cancel',
        },
      );

      setPermission(status ? 'granted' : 'denied');

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(location =>
          dispatch(
            setDeliveryAddress({
              id,
              addressInfo: {
                ...addressInfo,
                location: {
                  coordinates: [
                    location.coords.latitude.toString(),
                    location.coords.longitude.toString(),
                  ],
                },
              },
            }),
          ),
        );
      }
    })();
  };

  useEffect(() => {
    let location = addressInfo.location.coordinates;

    if (location === null) {
      askForLocationPermission();
    } else {
      getFeed({
        variables: {
          coordinates: location,
        },
      });
    }
  }, [addressInfo]);

  if (addressInfo.location.coordinates === null) {
    <Screen>
      <TabHeader name="Welcome, User" logo={true} namePress={() => {}} />
      <View flex center>
        <View width-50 centerH>
          <BoldText center text70>
            We need to detect your location in order to find the nearest store
            to you.
          </BoldText>
          <Button
            label={'Fetch Location'}
            disabled={false}
            size={Button.sizes.medium}
            backgroundColor={Colors.$backgroundDark}
            disabledBackgroundColor={Colors.$iconDisabled}
            round={true}
            marginT-10
            borderRadius={10}
            onPress={askForLocationPermission}
          />
        </View>
      </View>
    </Screen>;
  }

  if (feed) {
    return (
      <Feed
        data={feed}
        refreshing={fetchingFeed}
        onRefresh={() =>
          getFeed({
            variables: {
              coordinates: addressInfo.location.coordinates,
            },
          })
        }
        navigation={navigation}
      />
    );
  }

  if (fetchingUser || fetchingFeed) {
    return (
      <Screen>
        <View flex center>
          <ActivityIndicator color={Colors.primary} size="large" />
          <BoldText text70 marginT-10>
            Fetching nearby stores for you...
          </BoldText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View width-50 center flex>
        <BoldText center text70>
          Error fetching store status!
        </BoldText>
        <Button
          label={'Refresh'}
          disabled={false}
          size={Button.sizes.large}
          backgroundColor={Colors.$backgroundDark}
          disabledBackgroundColor={Colors.$iconDisabled}
          round={false}
          marginT-10
          borderRadius={10}
          onPress={askForLocationPermission}
        />
      </View>
    </Screen>
  );
}
