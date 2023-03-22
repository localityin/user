import React from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import moment from 'moment';

import {BoldText, Text} from '../Common/Text';
import {View} from '../Themed';

const {width: totalWidth} = Dimensions.get('window');
const cursorWidth = (totalWidth * 1) / 4;

interface DeliverySlider {
  onPress: any;
  active: any;
  data: any;
}

export default function DeliveryTime(props: DeliverySlider) {
  return (
    <>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          borderRadius: 10,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: Colors.$backgroundDarkElevated,
          backgroundColor: Colors.$backgroundDarkElevated,
        }}>
        {props.data.map((obj: any) => (
          <View
            style={{
              borderRadius: props.active === obj ? 10 : 0,
              width: cursorWidth * 0.95,
              height: 40,
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: props.active === obj ? 10 : 0,
                backgroundColor:
                  props.active === obj
                    ? Colors.$iconPrimary + '00'
                    : Colors.$backgroundDarkElevated,
                shadowColor: 'transparent',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: props.active === obj ? 5 : 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              delayPressIn={0}
              key={obj.n}
              onPress={() => props.onPress(obj)}>
              <BoldText
                style={
                  {
                    // color: props.active === obj ? Colors.text : '#555',
                  }
                }>
                {obj.type}
              </BoldText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{backgroundColor: 'transparent'}}>
        <Text>
          {props.active.text}{' '}
          <BoldText>
            {moment(Date.now() + parseFloat(props.active.n)).format(
              'ddd, hh:mm A',
            )}
          </BoldText>
        </Text>
      </View>
    </>
  );
}
