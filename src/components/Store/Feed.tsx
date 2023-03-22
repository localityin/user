import AntDesign from 'react-native-vector-icons/AntDesign';

import {useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {
  Button,
  Colors,
  Constants,
  Dialog,
  PanningProvider,
} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';

import Screen from '../Common/Screen';
import {SearchButton} from '../Common/SearchList';
import {BoldText, Text} from '../Common/Text';
import {View} from '../Themed';
import TabHeader from './TabHeader';

import {setDeliveryAddress} from '../../context/Store/actions';

import Sizes from '../../constants/Sizes';
import {useNavigation} from '@react-navigation/native';
import {ProductProps} from './OrderCard';
import ProductTile from './ProductTile';

interface FeedProps {
  data: {
    store: {
      id: string;
      available: boolean;
    };
    alikeProducts: Array<ProductProps>;
    recentProducts: Array<ProductProps>;
  };
  navigation: any;
  refreshing: boolean;
  onRefresh: any;
}

interface ChangeAddressProps {
  visible: boolean;
  setVisible: any;
}

function ChangeAddress(props: ChangeAddressProps) {
  const dispatch: any = useDispatch();
  const navigation = useNavigation();

  const {user} = useSelector((state: any) => state.userReducer);

  const [toSetAddress, setToSetAddress] = useState<any>({id: null});

  return (
    <Dialog
      bottom={true}
      visible={props.visible}
      onDismiss={() => props.setVisible(false)}
      panDirection={PanningProvider.Directions.DOWN}
      containerStyle={{
        backgroundColor: Colors.$backgroundDefault,
        marginBottom: Constants.isIphoneX ? 0 : 20,
        borderRadius: 12,
      }}
      ignoreBackgroundPress={false}>
      {toSetAddress.id ? (
        <View spread>
          <View marginT-20 marginH-20>
            <Text $textDefault text60>
              Confirm
            </Text>
            <View
              center
              marginT-10
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.$backgroundDarkElevated,
              }}
            />
            <Text text70 $textDefault marginT-10>
              Use {toSetAddress.addressInfo?.name.trim()} (
              {toSetAddress.addressInfo?.line1.trim()}) as your delivery
              address?
            </Text>
            <View margin-15 marginH-0 right w-100 spread row>
              <Button
                padding-5
                paddingL-0
                text70
                $textDefault
                label="Cancel"
                link
                onPress={() =>
                  setToSetAddress({
                    id: null,
                  })
                }
              />
              <Button
                label={'Confirm'}
                size={Button.sizes.small}
                backgroundColor={Colors.primary}
                color={Colors.white}
                round={false}
                text70
                padding-5
                borderRadius={5}
                onPress={() => {
                  dispatch(setDeliveryAddress(toSetAddress));
                  setToSetAddress({id: null});
                  props.setVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View spread style={{maxHeight: Sizes.screen.height / 2}}>
          <View marginV-10 marginH-20>
            <BoldText text70 marginB-10>
              Pick one from your address book
            </BoldText>
            <FlatList
              data={user.deliveryAddresses || []}
              contentContainerStyle={{paddingBottom: 10}}
              ListFooterComponent={() => (
                <TouchableOpacity
                  style={{
                    height: 45,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    props.setVisible(false);
                    navigation.navigate('SetAddress', {
                      set: true,
                      onNextRoute: 'Root',
                      backDisabled: false,
                    });
                  }}>
                  <AntDesign
                    name="plus"
                    size={Sizes.icon.small}
                    color={Colors.primary}
                  />
                  <Text text70 marginL-10>
                    Add New Address
                  </Text>
                </TouchableOpacity>
              )}
              renderItem={({item}) => (
                <View
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                    backgroundColor: Colors.$iconPrimary + '22',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                    activeOpacity={0.7}
                    onPress={() =>
                      setToSetAddress({
                        id: item.id,
                        addressInfo: {
                          name: item.name,
                          line1: item.line1,
                          location: item.location,
                        },
                      })
                    }>
                    <Text>{item.name}</Text>
                    <Text text70 numberOfLines={1}>
                      {item.line1}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </Dialog>
  );
}

export default function Feed(props: FeedProps) {
  const {addressInfo} = useSelector((state: any) => state.deliveryReducer);

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  return (
    <Screen>
      <ChangeAddress visible={dialogVisible} setVisible={setDialogVisible} />
      <TabHeader
        name={addressInfo.name || 'Current Location'}
        logo={true}
        namePress={() => setDialogVisible(true)}
        deliveryLocation={true}
        onPressAddress={() => setDialogVisible(true)}
      />

      {props.data.store.available ? (
        <FlatList
          data={[1]}
          refreshing={props.refreshing}
          refreshControl={
            <RefreshControl
              refreshing={props.refreshing}
              onRefresh={props.onRefresh}
              tintColor={Colors.$iconPrimary}
              progressBackgroundColor={Colors.$backgroundDefault}
            />
          }
          ListHeaderComponent={() => (
            <SearchButton
              placeholder="Search Products..."
              onPress={() => props.navigation.navigate('Search')}
            />
          )}
          ListFooterComponent={() => (
            <>
              <FlatList
                data={props.data.recentProducts}
                listKey={'04323942341'}
                keyExtractor={product => product.id}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                ListHeaderComponent={() => (
                  <View marginB-15>
                    <BoldText text70>Products you recently ordered</BoldText>
                  </View>
                )}
                renderItem={({item}) => <ProductTile item={item} />}
              />
              <FlatList
                data={props.data.alikeProducts}
                keyExtractor={product => product.id}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                listKey={'04323942342'}
                ListHeaderComponent={() => (
                  <View marginB-15>
                    <BoldText text70>Popular products from store</BoldText>
                  </View>
                )}
                renderItem={({item}) => <ProductTile item={item} />}
              />
            </>
          )}
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: number) => item.toString()}
          renderItem={() => <></>}
        />
      ) : (
        <View flex width-50 center>
          <BoldText center text70>
            There seems to be no stores nearby, change delivery location and try
            again in some time!
          </BoldText>
        </View>
      )}
    </Screen>
  );
}
