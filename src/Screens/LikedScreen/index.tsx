import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Post as data } from './Data';
import PostItem from './Components/PostItem';
import { LikedStyles } from '../../StyleSheet/LikedStyles';
import { useTheme } from '../../util/ThemeContext';

const Filter = ['Newest to oldest', 'All dates', 'All content types', 'Author'];

export const LikedScreen = () => {
  const [selected, setSelected] = useState<any[]>([]);
  const {theme} = useTheme();
  const styles = LikedStyles(theme);
  
  const onHandleSelect = useCallback((item: any) => {
    const isSelected = selected.some((prev) => prev.postID === item.postID);
    if(isSelected){
      const filter = selected.filter((prev) => prev.postID !== item.postID);
      setSelected(filter);
    }else{
      setSelected((prev) => [...prev, item]);
    }
  }, [selected]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/icon/left.png')} style={styles.iconBack}/>
        <Text style={styles.title}>Likes</Text>
        <TouchableOpacity onPress={() => setSelected([])}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.horiContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {Filter.map(item => (
          <TouchableOpacity style={styles.filterContainer} key ={item}>
            <Text>{item}</Text>
            <Image source={require('../../../assets/icon/down.png')} style={[styles.iconBack, {width: 10,}]}/>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
      <View style={styles.container}>
        <FlashList
        data={data}
        numColumns={3}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          const isSelected = selected.some((prev) => prev.postID === item.postID);
          return (
            <PostItem data={item} onHandle={() => {onHandleSelect(item)}} isSelect={isSelected}/>
          );
        }}
        extraData={selected}/>
      </View>
      {selected.length > 0 && (
        <TouchableOpacity style={styles.horiContainer}>
          <Text style={styles.unlike}>Unlike ({selected.length})</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
