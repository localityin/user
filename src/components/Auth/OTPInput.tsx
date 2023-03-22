import OTPInputView from '@twotalltotems/react-native-otp-input';
import {Button, Colors, View} from 'react-native-ui-lib';

import ResendOTP from './ResendOTP';
import {BoldText} from '../Common/Text';

import Sizes from '../../constants/Sizes';

interface OTPProps {
  secureCode: string;
  setSecureCode: any;
  onNext: any;
  date: string;
  onNew: any;
}

export function OTPInput(props: OTPProps) {
  return (
    <View flex>
      <View
        style={{
          backgroundColor: 'transparent',
          flexDirection: 'column',
          width: '100%',
          marginVertical: 10,
          height: 70,
        }}
        flex>
        <BoldText text70>One Time Paassword</BoldText>
        <OTPInputView
          style={{width: '100%', height: 90}}
          pinCount={6}
          code={props.secureCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged={code => {
            props.setSecureCode(code);
          }}
          autoFocusOnLoad={false}
          codeInputFieldStyle={{
            width: 45,
            height: 60,
            borderWidth: 2,
            fontFamily: 'Inter-Regular',
            fontSize: Sizes.font.header,
            color: Colors.text,
          }}
          codeInputHighlightStyle={{
            borderColor: Colors.primary,
            color: Colors.primary,
          }}
          selectionColor={Colors.primary}
        />
        <ResendOTP date={props.date} onNew={props.onNew} />
      </View>
      <Button
        label={'Verify'}
        disabled={props.secureCode.trim().length === 0}
        size={Button.sizes.large}
        color={Colors.white}
        backgroundColor={Colors.primary}
        disabledBackgroundColor={Colors.$iconDisabled}
        round={false}
        borderRadius={10}
        marginT-50
        marginB-10
        onPress={props.onNext}
      />
    </View>
  );
}
