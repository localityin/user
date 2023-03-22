import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {useMutation} from '@apollo/client';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Button, Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';

import Screen from '../../components/Common/Screen';
import {Header} from '../../components/Common/Header';
import {InputText} from '../../components/Common/Input';
import {Map} from '../../components/Common/Map';
import {CommonStyles} from '../../components/Common/Styles';
import {BoldText, Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';

import {setDeliveryAddress} from '../../context/Store/actions';
import {validateAddressInput} from '../../utils/validators';

import {DELETE_ADDRESS, UPDATE_ADDRESS} from '../../apollo/graphql/Common/user';

import Sizes from '../../constants/Sizes';
import {RootStackScreenProps} from '../../../types';
import {useNavigation} from '@react-navigation/native';

interface ISetAddress {
  back?: any;
  backDisabled: boolean;
  onNext: any;
}
interface IAdrs {
  id: string | null;
  addressInfo: {
    name: string;
    line1: string;
    location: {
      coordinates: [string, string];
    };
  };
}

export function SetAddressComponent(props: ISetAddress) {
  const dispatch: any = useDispatch();
  const [showMap, setShowMap] = useState(true);
  const [inputValid, setInputValid] = useState(false);
  const {addressInfo} = useSelector((state: any) => state.deliveryReducer);
  const navigation = useNavigation();

  const [adrs, setAdrs] = useState<IAdrs>({
    id: null,
    addressInfo: {
      name: '',
      line1: '',
      location: addressInfo.location,
    },
  });

  const [update, {loading}] = useMutation(UPDATE_ADDRESS, {
    variables: {
      id: adrs.id,
      addressInfo: adrs.addressInfo,
    },
    onCompleted(data) {
      if (data.updateAddress) {
        dispatch(
          setDeliveryAddress({id: adrs.id, addressInfo: adrs.addressInfo}),
        );
        props.onNext();
      }
    },
    onError(error) {
      console.log(adrs.addressInfo);
    },
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setShowMap(false); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowMap(true); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const {valid} = validateAddressInput(adrs.addressInfo);
    setInputValid(valid);
  }, [adrs]);

  useEffect(() => {
    const l = addressInfo.location;
    if (l.coordinates !== null) {
      setAdrs({...adrs, addressInfo: {...adrs.addressInfo, location: l}});
    }
  }, [addressInfo]);

  if (loading) {
    return (
      <View flex center>
        <BoldText text70>
          {adrs.id ? 'Editing address...' : 'Adding address...'}
        </BoldText>
      </View>
    );
  }

  return (
    <Screen>
      <View style={CommonStyles.header}>
        {!props.backDisabled && (
          <TouchableOpacity onPress={props.back}>
            <AntDesign
              name="back"
              size={Sizes.icon.header}
              color={Colors.$textDefault}
            />
          </TouchableOpacity>
        )}
        <BoldText text40>Set Address</BoldText>
      </View>
      <Text text70 marginB-10>
        Please enter your address for delivery
      </Text>
      <InputText
        autoFocus={true}
        value={adrs.addressInfo.line1}
        onChange={(text: string) =>
          setAdrs({
            ...adrs,
            addressInfo: {
              ...adrs.addressInfo,
              line1: text,
            },
          })
        }
        title="Apartment, Street Address"
        placeholder="Eg. A1/101, Hakur Apartments"
      />
      <InputText
        value={adrs.addressInfo.name}
        onChange={(text: string) =>
          setAdrs({
            ...adrs,
            addressInfo: {
              ...adrs.addressInfo,
              name: text,
            },
          })
        }
        title="Label"
        placeholder="Eg. Home"
      />
      {showMap && (
        <>
          <View flex marginT-10 br30>
            <Map />
          </View>
          <Button
            label={loading ? 'Loading...' : 'Confirm Address'}
            disabled={loading || !inputValid}
            size={Button.sizes.large}
            backgroundColor={Colors.primary}
            color={Colors.text}
            disabledBackgroundColor={Colors.$iconDisabled}
            round={false}
            borderRadius={10}
            marginV-10
            onPress={() =>
              update({
                variables: {
                  id: adrs.id,
                  addressInfo: adrs.addressInfo,
                },
              })
            }
          />
        </>
      )}
    </Screen>
  );
}

// view to update or set new address
export default function ({
  route,
  navigation,
}: RootStackScreenProps<'SetAddress'>) {
  const dispatch: any = useDispatch();

  const {onNextRoute, backDisabled, set} = route.params;
  const [editing, setEditing] = useState(set);

  const {user} = useSelector((state: any) => state.userReducer);

  const [activeAddress, setActiveAddress] = useState<any>({
    id: null,
    addressInfo: null,
  });

  const [deleteAddress, {loading: deleting}] = useMutation(DELETE_ADDRESS, {
    variables: {
      id: activeAddress.id,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.deleteAddress) {
        setActiveAddress({
          id: null,
          addressInfo: null,
        });
      }
    },
    onError(error) {
      console.log(error);
    },
  });

  function handleDelete(address: any) {
    setActiveAddress(address);
    if (activeAddress.id) {
      Alert.alert(
        'Confirm Deletion',
        `Click on confirm to delete address ${address.line1}`,
        [
          {
            text: 'Confirm',
            style: 'destructive',
            onPress: () =>
              deleteAddress({
                variables: {
                  id: activeAddress.id,
                },
              }),
          },
          {
            text: 'Cancel',
            onPress: () =>
              setActiveAddress({
                id: null,
                addressInfo: null,
              }),
          },
        ],
      );
    }
  }

  function handleSelect(item: any) {
    if (onNextRoute) {
      dispatch(
        setDeliveryAddress({
          id: item.id,
          addressInfo: {
            name: item.name,
            line1: item.line1,
            location: item.location,
          },
        }),
      );
      navigation.navigate(onNextRoute);
    } else {
      setActiveAddress({
        id: item.id,
        addressInfo: {
          name: item.name,
          line1: item.line1,
          location: item.location,
        },
      });
    }
  }

  useEffect(() => {
    if (backDisabled) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
      return () => backHandler.remove();
    }
  }, []);

  if (editing) {
    return (
      <SetAddressComponent
        back={() => setEditing(false)}
        backDisabled={backDisabled}
        onNext={() => {
          navigation.navigate(onNextRoute);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <Screen>
      <Header
        title="Select Address"
        onBack={() => navigation.navigate('Profile')}
      />
      <View flex>
        <FlatList
          data={user.deliveryAddresses}
          extraData={user}
          contentContainerStyle={{flex: 1}}
          renderItem={({item}) => (
            <View
              style={{
                width: '100%',
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor:
                    activeAddress.id === item.id
                      ? 'transparent'
                      : Colors.$iconPrimary + '22',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                activeOpacity={0.7}
                onPress={() => {
                  activeAddress.id
                    ? setActiveAddress({...activeAddress, id: null})
                    : handleSelect(item);
                }}>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    maxWidth: '80%',
                  }}>
                  <Text>{item.name}</Text>
                  <Text text70 numberOfLines={1}>
                    {item.line1}
                  </Text>
                </View>
                {activeAddress.id !== item.id && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                    }}>
                    <TouchableOpacity
                      style={{marginLeft: 20}}
                      onPress={() => handleDelete(item)}>
                      <AntDesign name="delete" size={Sizes.icon.normal} />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>

              {activeAddress.id === item.id && (
                <TouchableOpacity
                  style={{marginLeft: 20, marginRight: 10}}
                  onPress={() => handleDelete(item)}
                  disabled={deleting}>
                  {deleting ? (
                    <ActivityIndicator color={Colors.red20} />
                  ) : (
                    <AntDesign
                      name="check"
                      size={Sizes.icon.normal}
                      color={Colors.red20}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={{
            height: 45,
            width: '100%',
            padding: 10,
            borderRadius: 5,
            backgroundColor: Colors.$backgroundDark,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}
          activeOpacity={0.7}
          onPress={() => setEditing(true)}>
          <AntDesign
            name="plus"
            size={Sizes.icon.header}
            color={Colors.$backgroundDisabled}
          />
          <Text
            style={{
              color: Colors.white,
            }}
            marginL-20
            text70>
            Add new address
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
