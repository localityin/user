import React from 'react';
import {StatusBar, ViewProps} from 'react-native';
import {Colors} from 'react-native-ui-lib';

import useColorScheme from '../../hooks/useColorScheme';

import {View} from '../Themed';

const Screen = (props: ViewProps): JSX.Element => {
  const colorScheme = useColorScheme();

  return (
    <>
      {/* <StatusBar
        barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
        backgroundColor={"transparent"}
      /> */}
      <View
        style={{
          flex: 1,
          width: '100%',
          padding: 10,
          backgroundColor: Colors.$backgroundDefault,
        }}
        {...props}>
        {props.children}
      </View>
    </>
  );
};

export default Screen;
