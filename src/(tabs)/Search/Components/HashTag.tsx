import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import User from '../../../../components/User';
import Video from 'react-native-video';

const dataUser = [
  {
    id: 1,
    name: 'user1',
    image:
      'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
    status: 1,
  },
  {
    id: 2,
    name: 'user2',
    image:
      'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
    status: 1,
  },
  {
    id: 3,
    name: 'user3',
    image:
      'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
    status: 0,
  },
  {
    id: 4,
    name: 'user4',
    image:
      'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
    status: 0,
  },
  {
    id: 5,
    name: 'user1',
    image:
      'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
    status: 1,
  },
  {
    id: 6,
    name: 'user2',
    image:
      'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
    status: 1,
  },
  {
    id: 7,
    name: 'user3',
    image:
      'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
    status: 0,
  },
  {
    id: 8,
    name: 'user4',
    image:
      'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
    status: 0,
  },
  {
    id: 9,
    name: 'user1',
    image:
      'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
    status: 1,
  },
  {
    id: 10,
    name: 'user2',
    image:
      'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
    status: 1,
  },
  {
    id: 11,
    name: 'user3',
    image:
      'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
    status: 0,
  },
  {
    id: 12,
    name: 'user4',
    image:
      'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
    status: 0,
  },
  {
    id: 13,
    name: 'user1',
    image:
      'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
    status: 1,
  },
  {
    id: 14,
    name: 'user2',
    image:
      'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
    status: 1,
  },
  {
    id: 15,
    name: 'user3',
    image:
      'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
    status: 0,
  },
  {
    id: 16,
    name: 'user4',
    image:
      'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
    status: 0,
  },
];


const SearchUser = (props: any) => {
    const {searchText} = props

  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <View style={{flex: 1,
        backgroundColor: color.background
    }}>
        <FlashList
          data={dataUser}
          renderItem={({item}: any) => {
            return (
              <User
                name={item.name}
                image={item.image}
                isStory={false}
                isHashTag={true}
              />
            );
          }}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
        />
      
    </View>
  );
};

export default SearchUser;

const styles = StyleSheet.create({});
