import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useLazyQuery} from '@apollo/client';
import {useSelector} from 'react-redux';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Screen from '../../components/Common/Screen';
import {Header} from '../../components/Common/Header';
import {SearchButton} from '../../components/Common/SearchList';
import {Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';
import {TextInput} from '../../components/Common/Input';

const renderItem = ({item}: {item: ProductProps}) => (
  <FeedProductTile item={item} />
);
const keyExtractor = (e: ProductProps) => e.id;

import Sizes from '../../constants/Sizes';
import {
  SEARCH_PRODUCTS,
  SEARCH_PRODUCTS_NAME,
} from '../../apollo/graphql/Store/products';

import {RootTabScreenProps} from '../../../types';
import {ProductProps} from '../../components/Store/OrderCard';
import FeedProductTile from '../../components/Store/ProductTile';

export default function Search({navigation}: RootTabScreenProps<'Store'>) {
  const flatListRef = useRef(null);

  const {feed} = useSelector((state: any) => state.feedReducer);

  const [searching, setSearching] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const [data, setData] = useState<any>({
    data: [],
    error: false,
    text: 'Search for products from a store near you.',
  });

  const [products, setProducts] = useState<any>({
    data: [],
    error: false,
    text: '',
  });

  const [lookUpName, {loading: loadingNames}] = useLazyQuery(
    SEARCH_PRODUCTS_NAME,
    {
      variables: {
        name: search,
        limit: 5,
        storeId: feed.store.id,
      },
      onCompleted(data) {
        var filtered: Array<any> = [];
        data.getProductsFromStore.products.forEach((product: ProductProps) => {
          var index = filtered.findIndex((e: any) => e.name === product.name);
          if (index <= -1) {
          } else {
            filtered.push(product);
          }
        });
        setData({data: data.getProductsFromStore.products, error: ''});
      },
      onError(err) {
        setData({
          data: data.getProductsFromStore.products || [],
          error: true,
          text: `No results found for ${search.trim()}`,
        });
        console.log(err);
      },
    },
  );

  const [lookUpProducts, {loading: loadingProducts}] = useLazyQuery(
    SEARCH_PRODUCTS,
    {
      variables: {
        name: search,
        limit: 10,
        storeId: feed.store.id,
      },
      onCompleted(data) {
        setProducts({
          data: data.getProductsFromStore.products || [],
          error: '',
        });
        setSearch('');
      },
      onError(error) {
        console.log({...error});
      },
    },
  );

  useEffect(() => {
    if (search.trim().length > 0) {
      lookUpName({
        variables: {
          name: search,
          storeId: feed.store.id,
          limit: 10,
        },
      });
    } else {
      setData({data: [], error: false, text: ''});
    }
  }, [search]);

  if (searching) {
    return (
      <Screen>
        <Header title="Search" onBack={() => navigation.navigate('Store')} />
        <View flex>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: Colors.$backgroundDisabled + '77',
              marginBottom: 15,
            }}>
            <TextInput
              autoFocus={true}
              value={search}
              placeholder={'Search Products'}
              onChangeText={text => setSearch(text)}
              selectionColor={Colors.primary}
              style={{
                flex: 1,
                fontSize: Sizes.font.text,
              }}
            />
            {search.trim().length > 0 && (
              <View row center style={{backgroundColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => setSearch('')}
                  style={{marginRight: 15}}>
                  <AntDesign name="close" size={Sizes.icon.normal} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    lookUpProducts({
                      variables: {
                        name: search,
                        limit: 10,
                        storeId: feed.store.id,
                      },
                    });
                    setSearching(false);
                  }}
                  disabled={search.trim().length > 0 ? false : true}>
                  <AntDesign
                    name="arrowright"
                    size={Sizes.icon.normal}
                    color={
                      search.trim().length > 0
                        ? Colors.primary
                        : Colors.$backgroundDisabled
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {loadingNames ? (
            <View style={{height: 310, width: '100%', borderRadius: 5}}>
              {[1, 2, 3].map(e => (
                <View
                  style={{
                    height: 40,
                    width: '100%',
                    backgroundColor: Colors.$backgroundDisabled + '66',
                    marginBottom: 5,
                  }}
                />
              ))}
            </View>
          ) : (
            <FlatList
              data={data.data}
              keyExtractor={e => e.id}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    width: '80%',
                    alignSelf: 'center',
                    marginBottom: 5,
                  }}
                />
              )}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      width: '100%',
                      borderRadius: 5,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setSearching(false);
                      setSearch(item.name);
                      lookUpProducts({
                        variables: {
                          name: item.name,
                          limit: 10,
                          storeId: feed.store.id,
                        },
                      });
                    }}>
                    <View row center>
                      {/* <Feather
                        name="trending-up"
                        size={Sizes.font.text}
                        color={Colors.$iconPrimary + '99'}
                        style={{marginRight: 10}}
                      /> */}
                      <Text text70>{item.name}</Text>
                    </View>
                    <AntDesign
                      name="arrowright"
                      size={Sizes.font.text}
                      color={Colors.$backgroundDisabled}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Search"
        onBack={() => navigation.navigate('Store')}
        cartIcon={true}
      />
      <SearchButton
        placeholder={'Search Products...'}
        onPress={() => setSearching(true)}
      />
      {!loadingProducts ? (
        <FlatList
          ref={flatListRef}
          data={products.data}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={renderItem}
        />
      ) : (
        <View flex center>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      )}
    </Screen>
  );
}
