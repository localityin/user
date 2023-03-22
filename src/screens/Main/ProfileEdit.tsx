import {useLazyQuery, useMutation} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Button, Colors} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import {TWOFACTOR_AUTH} from '../../apollo/graphql/Common/auth';
import {EDIT_PROFILE} from '../../apollo/graphql/Common/user';

import {Header} from '../../components/Common/Header';
import {InputText, TextInput} from '../../components/Common/Input';
import Screen from '../../components/Common/Screen';
import {BoldText, Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';

import {RootStackScreenProps} from '../../../types';

export default function ProfileEdit({
  navigation,
}: RootStackScreenProps<'ProfileEdit'>) {
  const {user} = useSelector((state: any) => state.userReducer);

  const [changed, setChanged] = useState(false);
  const [focus, setFocus] = useState(false);
  const [meta, setMeta] = useState({
    tf: false,
    date: '',
  });
  const [error, setError] = useState({
    e: false,
    message: '',
  });
  const [secureCode, setSecureCode] = useState<string>('');
  const [editProfileInfo, setEditProfileInfo] = useState({
    name: user.name,
    contact: user.contact,
  });

  useEffect(() => {
    if (
      editProfileInfo.name !== user.name ||
      editProfileInfo.contact !== user.contact
    ) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [editProfileInfo]);

  const [editProfile, {loading}] = useMutation(EDIT_PROFILE, {
    variables: {
      userInfoInput: editProfileInfo,
    },
    onCompleted(data) {
      if (data.editProfile) {
        navigation.navigate('Profile');
      }
    },
    onError(error) {
      console.log({...error});
    },
  });

  const [tFA] = useLazyQuery(TWOFACTOR_AUTH, {
    variables: {
      contact: editProfileInfo.contact,
      newAcc: true,
    },
    onCompleted(data) {
      if (data.twoFactorAuth.error) {
        setError({
          e: true,
          message: data.twoFactorAuth.message,
        });
      } else {
        setSecureCode('');
        setMeta({tf: true, date: data.twoFactorAuth.date});
      }
    },
  });

  if (loading) {
    return (
      <View flex center>
        <BoldText text70>Editing profile...</BoldText>
      </View>
    );
  }

  // if(meta.tf){
  //   return
  // }

  return (
    <Screen>
      <Header
        title="Edit Details"
        onBack={() => {
          navigation.navigate('Profile');
        }}
      />
      <Text text70 marginB-20>
        Make changes here and submit. Frequent changes made may stop you from
        editing for some time.
      </Text>
      <InputText
        title="Name"
        value={editProfileInfo.name}
        onChange={(text: string) =>
          setEditProfileInfo({...editProfileInfo, name: text})
        }
        placeholder="Your Name"
      />

      <BoldText
        text70
        marginT-10
        style={{color: focus ? Colors.$iconPrimary : Colors.$textDefault}}>
        Contact No.
      </BoldText>
      <View row centerV marginT-5>
        <TouchableOpacity>
          <Text text70>{editProfileInfo.contact.ISD}</Text>
        </TouchableOpacity>
        <TextInput
          keyboardType="phone-pad"
          placeholder="Contact Number"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={editProfileInfo.contact.number}
          onChangeText={(text: string) =>
            setEditProfileInfo({
              ...editProfileInfo,
              contact: {...editProfileInfo.contact, number: text},
            })
          }
          style={{marginLeft: 10}}
        />
      </View>
      <View flex />
      {changed && (
        <Button
          label={'Edit Profile'}
          disabled={
            editProfileInfo.contact.number.length < 10 ||
            editProfileInfo.name > 3
          }
          size={Button.sizes.large}
          backgroundColor={Colors.$backgroundDarkActive}
          disabledBackgroundColor={Colors.$iconDisabled}
          round={false}
          borderRadius={10}
          marginT-50
          marginB-10
          onPress={
            () =>
              editProfile({
                variables: {
                  userInfoInput: editProfileInfo,
                },
              })
            // tFA({
            //   variables: {
            //     contact: editProfileInfo.contact,
            //     newAcc: true,
            //   },
            // })
          }
        />
      )}
    </Screen>
  );
}
