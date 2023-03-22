import React, {useEffect, useRef, useState} from 'react';
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps';
import {TouchableOpacity, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';

import AntDesign from 'react-native-vector-icons/AntDesign';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {Colors} from 'react-native-ui-lib';

import {View} from '../Themed';
import {BoldText} from './Text';

import {setDeliveryAddress} from '../../context/Store/actions';
import useColorScheme from '../../hooks/useColorScheme';

import {darkMapStyle, lightMapStyle} from '../../constants/MapStyle';
import Sizes from '../../constants/Sizes';

interface MapProps {
  handleLocation?: any;
  location?: [string, string];
  track?: boolean;
}

export function Map(props: MapProps) {
  const colorScheme = useColorScheme();
  const dispatch: any = useDispatch();

  const mapRef = useRef<MapView>(null);

  const [permission, setPermission] = useState<string | null>(null);

  const {id, addressInfo} = useSelector((state: any) => state.deliveryReducer);

  const askForLocationPermission = () => {
    (async () => {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Locality Location permission',
          message:
            'Locality App needs to access precise location to render map services for you.',
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
    }
  }, [addressInfo]);

  if (permission !== 'granted') {
    return (
      <View flex center>
        <BoldText style={{width: '60%'}}>
          Permission not granted. Enable location permission to view map.
        </BoldText>
        <TouchableOpacity
          onPress={() => askForLocationPermission()}
          style={{marginTop: 10}}>
          <AntDesign
            name="reload1"
            size={Sizes.icon.header}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    );
  }

  if (addressInfo.location.coordinates === null) {
    return (
      <View flex center>
        <BoldText>Loading map...</BoldText>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
      }}>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: parseFloat(addressInfo.location.coordinates[0]),
          longitude: parseFloat(addressInfo.location.coordinates[1]),
          latitudeDelta: 0.0011,
          longitudeDelta: 0.0018,
        }}
        provider={PROVIDER_DEFAULT}
        customMapStyle={colorScheme === 'light' ? lightMapStyle : darkMapStyle}
        showsMyLocationButton={true}
        showsUserLocation={true}
        style={{flex: 1, zIndex: 999}}
        onRegionChangeComplete={e => {
          dispatch(
            setDeliveryAddress({
              id,
              addressInfo: {
                ...addressInfo,
                location: {
                  coordinates: [e.latitude.toString(), e.longitude.toString()],
                },
              },
            }),
          );
        }}>
        {/* {props.track && (
        <>
          <Marker
            identifier="origin"
            coordinate={{
              latitude: parseFloat(origin.location.latitude),
              longitude: parseFloat(origin.location.longitude),
            }}
          />
          <Marker
            identifier="destination"
            coordinate={{
              latitude: parseFloat(destination.location.latitude),
              longitude: parseFloat(destination.location.longitude),
            }}
          />
        </>
      )} */}
        {/* <Marker
          identifier="user"
          
          coordinate={{
            latitude: parseFloat(userLocation.latitude),
            longitude: parseFloat(userLocation.longitude),
          }}
        /> */}
      </MapView>
      <View
        style={{
          zIndex: 999,
          backgroundColor: 'transparent',
          position: 'absolute',
          top: '41%',
          left: '42%',
        }}>
        <AntDesign name="pushpin" color={Colors.primary} size={35} />
      </View>
    </View>
  );
}
