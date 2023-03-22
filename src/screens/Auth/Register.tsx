import React, {useEffect, useState} from 'react';
import {Button, Colors, View} from 'react-native-ui-lib';
import {Alert, BackHandler, StatusBar} from 'react-native';
import {useLazyQuery, useMutation} from '@apollo/client';
import {useDispatch} from 'react-redux';

import Screen from '../../components/Common/Screen';
import {Header} from '../../components/Common/Header';
import {TextInput} from '../../components/Common/Input';
import {BoldText, Text} from '../../components/Common/Text';
import ContactInput from '../../components/Auth/ContactInput';
import {OTPInput} from '../../components/Auth/OTPInput';

import {CHECK_AUTH, TWOFACTOR_AUTH} from '../../apollo/graphql/Common/auth';
import {REGISTER_USER} from '../../apollo/graphql/Common/user';

import Sizes from '../../constants/Sizes';
import {setUser} from '../../context/Common/actions';

import {AuthStackScreenProps} from '../../../types';

export default function Register({
  navigation,
}: AuthStackScreenProps<'Register'>) {
  const dispatch: any = useDispatch();

  // textinput feedback handler
  const [active, setActive] = useState<boolean>(false);

  // register states
  const [secureCode, setSecureCode] = useState<string>('');
  const [meta, setMeta] = useState({
    tfaScreen: false,
    registerScreen: false,
    date: '',
  });
  const [error, setError] = useState({
    e: false,
    message: '',
  });
  const [userInfoInput, setUserInfoInput] = useState({
    name: '',
    contact: {
      ISD: '+91',
      number: '',
    },
  });

  // apollo functions
  const [register, {loading: registering}] = useMutation(REGISTER_USER, {
    variables: {
      userInfoInput,
    },
    onCompleted(data) {
      dispatch(setUser(data.register, true));
    },
  });

  const [tfAuth, {loading: tfAuthing}] = useLazyQuery(TWOFACTOR_AUTH, {
    variables: {
      contact: userInfoInput.contact,
      newAcc: true,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.twoFactorAuth.error) {
        setError({
          e: true,
          message: data.twoFactorAuth.message,
        });
      } else {
        setSecureCode('');
        setMeta({...meta, tfaScreen: true, date: data.twoFactorAuth.date});
      }
    },
  });

  const [checkAuth, {loading: checkingAuth}] = useLazyQuery(CHECK_AUTH, {
    variables: {
      contact: userInfoInput.contact,
      secureCode,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (!data.checkAuth.error) {
        setMeta({...meta, registerScreen: true});
      }
    },
  });

  function handleBackButtonClick() {
    Alert.alert('Caution!', 'All changes will be lost', [
      {
        text: 'I Understand',
        style: 'destructive',
        onPress: () => {
          setUserInfoInput({
            name: '',
            contact: {
              ISD: '+91',
              number: '',
            },
          });
          setSecureCode('');
          setMeta({
            tfaScreen: false,
            registerScreen: false,
            date: '',
          });
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  if (meta.registerScreen) {
    return (
      <Screen>
        <View flex>
          <Text
            text70
            style={{
              marginTop: StatusBar.currentHeight + 50,
            }}>
            Almost there! What should you we call you?
          </Text>
          <TextInput
            autoFocus
            onBlur={() => setActive(false)}
            onFocus={() => setActive(true)}
            value={userInfoInput.name}
            onChangeText={(text: string) =>
              setUserInfoInput({...userInfoInput, name: text})
            }
            style={{
              fontSize: Sizes.font.text,
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginVertical: 10,
              borderColor: active
                ? Colors.$backgroundDarkActive
                : Colors.$backgroundDisabled,
            }}
            placeholder="Your Name"
          />
        </View>
        <Button
          label={'Register'}
          disabled={userInfoInput.name.trim().length <= 0}
          size={Button.sizes.large}
          backgroundColor={Colors.primary}
          disabledBackgroundColor={Colors.$iconDisabled}
          round={false}
          borderRadius={10}
          marginV-10
          onPress={() =>
            register({
              variables: {
                userInfoInput,
              },
            })
          }
        />
      </Screen>
    );
  }

  if (meta.tfaScreen) {
    return (
      <Screen>
        <Header
          title="Register"
          onBack={() => {
            setSecureCode('');
            setMeta({...meta, tfaScreen: false});
          }}
        />
        <Text text70>Enter 6 digit code sent to your registered number.</Text>
        <OTPInput
          secureCode={secureCode}
          setSecureCode={setSecureCode}
          date={meta.date}
          onNew={() =>
            tfAuth({
              variables: {
                contact: userInfoInput.contact,
                newAcc: true,
              },
            })
          }
          onNext={() =>
            checkAuth({
              variables: {
                contact: userInfoInput.contact,
                secureCode,
              },
            })
          }
        />
      </Screen>
    );
  }

  if (registering) {
    return (
      <Screen>
        <View flex center>
          <Text grey70>Getting store registeration confirmation ...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Register"
        onBack={() => navigation.navigate('Onboarding')}
      />
      <Text text70>Join with an unregistered mobile number.</Text>
      <ContactInput
        contact={userInfoInput.contact}
        loading={tfAuthing}
        onNext={() =>
          tfAuth({
            variables: {
              contact: userInfoInput.contact,
              newAcc: true,
            },
          })
        }
        setContact={(text: string) => {
          if (error.e) {
            setError({...error, e: false});
          }
          setUserInfoInput({
            ...userInfoInput,
            contact: {
              ...userInfoInput.contact,
              number: text,
            },
          });
        }}
      />
      <View flex></View>
      {error.e && (
        <View marginV-10 center>
          <BoldText text70 style={{color: Colors.red30}}>
            {error.message}
          </BoldText>
        </View>
      )}
    </Screen>
  );
}
