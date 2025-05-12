import {SafeAreaView, View} from 'react-native';
import React from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const Post = () => {
  const navigation: any = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      navigation.replace('AddPost');
    }, []),
  );

  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  );
};

export default Post;
