import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';

import Button from '../../components/Common/Button';
import Screen from '../../components/Common/Screen';
import {Section} from '../../components/Common/Section';
import {BoldText, Text} from '../../components/Common/Text';
import TabHeader from '../../components/Store/TabHeader';
import {View} from '../../components/Themed';

import useColorScheme from '../../hooks/useColorScheme';
import {removeUser} from '../../context/Common/actions';

import {RootTabScreenProps} from '../../../types';

export default function Profile({navigation}: RootTabScreenProps<'Profile'>) {
  const colorScheme = useColorScheme();
  const {user} = useSelector((state: any) => state.userReducer);

  const dispatch: any = useDispatch();

  function handleLogout() {
    dispatch(removeUser());
  }

  return (
    <Screen>
      <TabHeader name="Profile" logo={false} namePress={() => {}} />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 15,
        }}>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 5,
            backgroundColor: Colors.$backgroundDisabled,
            marginRight: 10,
          }}
          center>
          <TouchableOpacity>
            <Icon name="user" color={Colors.$textDefault + '66'} size={60} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: 100,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <BoldText text50>{user?.name || 'Username'}</BoldText>
            <Text text70>+91 {user?.contact.number}</Text>
          </View>
          <Text text70>
            Account Status: <BoldText green30>Active</BoldText>
          </Text>
        </View>
      </View>
      <Section
        title="Profile Settings"
        body={
          <View style={{flexDirection: 'column'}}>
            <Button
              label="Address Book"
              icon
              name="enviromento"
              fullWidth
              onPress={() =>
                navigation.navigate('SetAddress', {
                  set: false,
                  onNextRoute: 'SetAddress',
                  backDisabled: false,
                })
              }
            />
            <View style={{height: 5}} />
            <Button
              label="Profile Details"
              icon
              name="user"
              fullWidth
              onPress={() => navigation.navigate('ProfileEdit')}
            />
          </View>
        }
      />

      <Section
        title="App Settings"
        body={
          <View style={{flexDirection: 'column'}}>
            {/* <Button
              label={colorScheme == "light" ? "Dark Theme" : "Light Theme"}
              icon
              name="bulb1"
              fullWidth
              transparent
              onPress={handleLogout}
            /> */}
            <Button
              label="Logout"
              icon
              name="logout"
              fullWidth
              transparent
              onPress={handleLogout}
            />
          </View>
        }
      />
    </Screen>
  );
}
