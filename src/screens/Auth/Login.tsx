import {useLazyQuery, useMutation} from '@apollo/client';
import React, {useState} from 'react';
import {Colors} from 'react-native-ui-lib';
import {useDispatch} from 'react-redux';
import {CHECK_AUTH, TWOFACTOR_AUTH} from '../../apollo/graphql/Common/auth';
import {LOGIN_USER} from '../../apollo/graphql/Common/user';

import ContactInput from '../../components/Auth/ContactInput';
import {OTPInput} from '../../components/Auth/OTPInput';
import {Header} from '../../components/Common/Header';
import Screen from '../../components/Common/Screen';
import {BoldText, Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';
import {setUser} from '../../context/Common/actions';

import {AuthStackScreenProps} from '../../../types';

export default function Login({navigation}: AuthStackScreenProps<'Login'>) {
  const [contact, setContact] = useState({
    ISD: '+91',
    number: '',
  });
  const [meta, setMeta] = useState({
    tfScreen: false,
    date: '',
  });
  const [error, setError] = useState({
    e: false,
    message: '',
  });

  const [secureCode, setSecureCode] = useState<string>('');
  const dispatch: any = useDispatch();

  const [login, {loading}] = useMutation(LOGIN_USER, {
    variables: {
      contact,
    },
    onCompleted(data) {
      if (data.login) {
        dispatch(setUser(data.login, true));
      }
    },
  });

  const [tfAuth, {loading: tfAuthing}] = useLazyQuery(TWOFACTOR_AUTH, {
    variables: {
      contact,
      newAcc: false,
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
        setMeta({tfScreen: true, date: data.twoFactorAuth.date});
      }
    },
    onError(error) {
      console.log({...error});
    },
  });

  const [checkAuth, {loading: checkingAuth}] = useLazyQuery(CHECK_AUTH, {
    variables: {
      contact,
      secureCode,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (!data.checkAuth.error) {
        login({
          variables: {
            contact,
          },
        });
      }
    },
  });

  if (meta.tfScreen) {
    return (
      <Screen>
        <Header
          title="Login"
          onBack={() => {
            setSecureCode('');
            setMeta({...meta, tfScreen: false});
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
                contact,
                newAcc: false,
              },
            })
          }
          onNext={() =>
            checkAuth({
              variables: {
                contact,
                secureCode,
              },
            })
          }
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Login" onBack={() => navigation.navigate('Onboarding')} />
      <Text text70>Welcome back! Login with your registered number.</Text>
      <ContactInput
        contact={contact}
        loading={tfAuthing}
        onNext={() =>
          tfAuth({
            variables: {
              contact,
              newAcc: false,
            },
          })
        }
        setContact={(text: string) => {
          if (error.e) {
            setError({...error, e: false});
          }
          setContact({...contact, number: text});
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
