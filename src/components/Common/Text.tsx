/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {Colors, Text as DefaultText, TextProps} from 'react-native-ui-lib';

export function Text(props: TextProps) {
  const {style, ...otherProps} = props;

  return (
    <DefaultText
      style={[{color: Colors.$textDefault, fontFamily: 'Inter-Regular'}, style]}
      {...otherProps}
    />
  );
}

export function BoldText(props: TextProps) {
  const {style, ...otherProps} = props;

  return (
    <DefaultText
      style={[{color: Colors.$textDefault, fontFamily: 'Inter-Bold'}, style]}
      {...otherProps}
    />
  );
}
