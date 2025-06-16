/* eslint-disable react-native/no-inline-styles */
import {Image, Text, View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
// import User from '../../Home/components/Story';
import {AppDispatch, RootState} from '../../../../services/store';
import {useDispatch, useSelector} from 'react-redux';

const SearchTag: React.FC = React.memo(() => {
  const { posts } = useSelector((state: RootState) => state.post);

  // console.log('HashTag: ', posts);

  // const {searchText} = props;

  const {theme} = useTheme();
  const color = Colors[theme];
  const renderTag = React.useCallback(({ item }: { item: any }) => (
    <View style={[styles.row, { borderColor: color.border }]}>
      <Image source={require('../../../../assets/icon/hash.png')} style={[styles.hashIcon, { backgroundColor: color.card }]} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: color.text }]} numberOfLines={1}>
          {item._id}
        </Text>
        <Text style={[styles.subtitle, { color: color.text }]} numberOfLines={1}>
          {item.likeCount} Posts
        </Text>
      </View>
    </View>
  ), [color]);
  return (
    <View style={{flex: 1, backgroundColor: color.background}}>
      <FlashList
        data={posts}
        renderItem={({item}: any) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                borderBottomWidth: 1,
                borderColor: color.border,
              }}>
              <Image
                source={require('../../../../assets/icon/hash.png')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  marginRight: 4,
                  backgroundColor: color.card,
                }}
              />
              <View style={{padding: 4, marginLeft: 6}}>
                <Text
                  style={{fontWeight: 'bold', color: color.text, fontSize: 18}}
                  numberOfLines={1}>
                  {item._id}
                </Text>
                <Text
                  style={{fontWeight: '300', color: color.text, fontSize: 14}}
                  numberOfLines={1}>
                  {item.likeCount} Posts
                </Text>
                {/* Add more info here if needed, e.g. hashtag count, description, etc. */}
              </View>
            </View>
          );
        }}
        estimatedItemSize={50}
        keyExtractor={() => Math.random().toString()}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
    </View>
  );
});

export default SearchTag;

 const styles = StyleSheet.create({
   row: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 12,
     borderBottomWidth: 1,
   },
   hashIcon: {
     width: 40,
     height: 40,
     borderRadius: 14,
     marginRight: 4,
   },
   textContainer: {
     padding: 4,
     marginLeft: 6,
   },
   title: {
     fontWeight: 'bold',
     fontSize: 18,
   },
   subtitle: {
     fontWeight: '300',
     fontSize: 14,
   },
 });