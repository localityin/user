import {
  StyleSheet,
  TextInput as DefaultTextInput,
  TextInputProps,
} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {View} from '../Themed';
import {BoldText, Text} from './Text';

import Sizes from '../../constants/Sizes';
import {CommonStyles} from './Styles';

export function TextInput(props: TextInputProps) {
  const {style, ...otherProps} = props;

  return (
    <DefaultTextInput
      selectionColor={Colors.$iconPrimary}
      placeholderTextColor={Colors.$backgroundDarkActive}
      style={[
        {
          color: Colors.$textDefault,
          fontFamily: 'Input',
          fontSize: Sizes.font.text,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

interface LineInputProps {
  disabled?: boolean;
  underline?: boolean;
  value: string;
  onChangeText: any;
  placeholder: string;
}

export function LineInput(props: LineInputProps) {
  const [active, setActive] = useState(false);

  return (
    <TextInput
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      value={props.value}
      style={{
        borderBottomWidth: 1,
        paddingVertical: 5,
        marginBottom: 10,
        lineHeight: Sizes.font.text,
        borderBottomColor: active
          ? Colors.$backgroundDarkActive
          : Colors.$backgroundDisabled,
      }}
    />
  );
}

interface InputProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: any;
  error?: boolean;
  errorMessage?: string;
  constraint?: any;
  maxLength?: number;
  autoFocus?: boolean;
  autoCapitalize?: string;
  keyboardType?: string;
  autoCorrect?: boolean;
  mini?: boolean;
  search?: boolean;
  locked?: boolean;
}

export function InputText(props: InputProps) {
  const [focus, setFocus] = useState(false);

  return (
    <View
      style={{
        ...styles.inputContainer,
        width: props.mini ? '50%' : '100%',
        marginRight: props.mini ? 10 : 0,
      }}>
      <BoldText
        style={{
          color: props.locked
            ? '#666'
            : focus
            ? Colors.primary
            : Colors.$textDefault,
        }}
        text70
        marginB-5>
        {props.title}
      </BoldText>
      <View
        style={{
          ...styles.inputStyle,
          backgroundColor: 'transparent',
        }}>
        <TextInput
          placeholder={props.placeholder}
          value={props.value}
          onChangeText={text => props.onChange(text)}
          style={{
            flex: 1,
            marginRight: 10,
            fontSize: Sizes.font.text,
          }}
          placeholderTextColor={Colors.tabIconDefault}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          editable={!props.locked}
          selectionColor={Colors.primary}
        />
        {props.locked && <AntDesign name="lock1" size={Sizes.icon.normal} />}
      </View>
      {props.error && (
        <View style={CommonStyles.errorContainer}>
          <Text style={CommonStyles.errorText}>{props.errorMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginTop: 5,
    backgroundColor: 'transparent',
  },
  inputStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 0,
    paddingTop: 0,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  errorText: {
    marginLeft: 10,
    color: '#d00',
  },
});
