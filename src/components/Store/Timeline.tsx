import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, View} from 'react-native-ui-lib';

import {BoldText, Text} from '../Common/Text';
import {format, parseISO} from 'date-fns';

export interface CardProps {
  delivery: any;
  order: any;
}

export default function History(props: CardProps) {
  const [timeline, setTimeline] = useState([
    {
      id: '86597',
      bool: props.delivery.delivered,
      text: 'Delivered',
      subtext: props.delivery.deliveredAt
        ? `${format(parseISO(props.delivery.deliveredAt), 'dd-MM hh:mm')}`
        : '',
    },
    {
      id: '86598',
      bool: props.delivery.dispatched,
      text: 'Dispatched',
      subtext: props.delivery.dispatchedAt
        ? `${format(parseISO(props.delivery.dispatchedAt), 'dd-MM hh:mm')}`
        : '',
    },
    {
      id: '86599',
      bool: props.order.accepted,
      text: props.order.accepted ? 'Confirmed' : 'Awaiting Confirmation',
      subtext: props.order.accepted
        ? `Store confirmed your order`
        : `Waiting for store to confirm your order`,
    },
  ]);

  useEffect(() => {
    setTimeline([
      {
        id: '86511',
        bool: props.delivery.delivered,
        text: 'Delivered',
        subtext: props.delivery.deliveredAt
          ? `${format(parseISO(props.delivery.deliveredAt), 'dd-MM hh:mm')}`
          : '',
      },
      {
        id: '86522',
        bool: props.delivery.dispatched,
        text: 'Dispatched',
        subtext: props.delivery.dispatchedAt
          ? `${format(parseISO(props.delivery.dispatchedAt), 'dd-MM hh:mm')}`
          : '',
      },
      {
        id: '86533',
        bool: props.order.accepted,
        text: props.order.accepted ? 'Confirmed' : 'Awaiting Confirmation',
        subtext: props.order.accepted
          ? `Store confirmed your order`
          : `Waiting for store to confirm your order`,
      },
    ]);
  }, [props]);

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
      }}>
      <FlatList
        listKey={'42994993423'}
        data={timeline}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{
              width: '100%',
              height: 55,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                height: 60,
                width: '10%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Ionicons
                name={item.bool ? 'radio-button-on' : 'radio-button-off'}
                color={item.bool ? Colors.primary : Colors.$backgroundDisabled}
                size={20}
              />
              <View
                style={{
                  marginRight: 1,
                  width: 2,
                  height: 30,
                  backgroundColor: item.bool
                    ? Colors.primary
                    : Colors.$backgroundDisabled,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 10,
                paddingTop: 0,
              }}>
              <BoldText
                style={{
                  fontSize: 16,
                  color: item.bool
                    ? Colors.primary
                    : Colors.$backgroundDisabled,
                  textTransform: 'uppercase',
                }}>
                {item.text}
              </BoldText>
              {item.bool && <Text>{item.subtext}</Text>}
            </View>
          </View>
        )}
      />
    </View>
  );
}
