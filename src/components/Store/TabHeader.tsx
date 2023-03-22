import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {BoldText} from '../Common/Text';
import {View} from '../Themed';

import Sizes from '../../constants/Sizes';
import {CommonStyles} from '../Common/Styles';

interface TabHeaderProps {
  icon?: React.ComponentProps<typeof AntDesign>['name'];
  name: string;
  color?: string;
  namePress: any;
  iconPress?: any;
  logo: boolean;
  deliveryLocation?: boolean;
  onPressAddress?: any;
}
const TabHeader = (props: TabHeaderProps): JSX.Element => {
  return (
    <View style={CommonStyles.header}>
      <TouchableOpacity
        style={{flexDirection: 'column', alignItems: 'flex-start'}}
        activeOpacity={0.7}
        onPress={props.iconPress}>
        {props.logo && (
          <BoldText text80 style={{color: Colors.primary, marginTop: 20}}>
            locale.
          </BoldText>
        )}
        {props.deliveryLocation ? (
          <TouchableOpacity
            style={{
              maxWidth: '100%',
              padding: 10,
              paddingHorizontal: 0,
              backgroundColor: Colors.$transparent,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={props.onPressAddress}>
            <BoldText
              text50
              style={{
                fontSize: 20,
                lineHeight: 22,
                color: Colors.$iconNeutral,
              }}
              numberOfLines={1}>
              {props.name}
            </BoldText>
            <AntDesign
              name="right"
              color={Colors.$iconNeutral}
              size={Sizes.icon.normal - 5}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        ) : (
          <BoldText text40>{props.name}</BoldText>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={props.iconPress}>
        <AntDesign
          name={props.icon}
          size={Sizes.icon.normal}
          color={props.color || Colors.$textDefault}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TabHeader;
