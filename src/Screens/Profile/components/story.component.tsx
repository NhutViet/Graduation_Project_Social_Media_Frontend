import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Styles} from '../../../StyleSheet/Profile.Styles';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {handleHighlightPress} from '../../../(tabs)/Home/util/index';
import {AppDispatch} from '@services/store';

interface HighlightItem {
  _id: string;
  thumbnail: string;
  collectionName: string;
  storyId: string[]; // quan trọng nếu cần truyền cho handleHighlightPress
}

const StoryComponent = ({
  isPrivate,
  highlights,
  viewerUser,
  dispatch,
  navigation,
}: {
  isPrivate: boolean;
  highlights: HighlightItem[];
  viewerUser: any;
  dispatch: AppDispatch;
  navigation: any;
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const renderStoryItem = ({item}: {item: HighlightItem}) => (
    <TouchableOpacity
      key={item._id}
      style={Styles.styles.highlightItem}
      onPress={() =>
        handleHighlightPress(item, dispatch, navigation, viewerUser, false)
      }>
      <View style={Styles.styles.highlightImageContainer}>
        <Image
          source={{uri: item.thumbnail}}
          style={Styles.styles.highlightImage}
        />
      </View>
      <Text style={[Styles.styles.highlightTitle, {color: color.text}]}>
        {item.collectionName}
      </Text>
    </TouchableOpacity>
  );

  return isPrivate ? (
    <View style={Styles.styles.highlightsContainer}>
      <FlashList
        data={highlights}
        renderItem={renderStoryItem}
        estimatedItemSize={50}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
      />
    </View>
  ) : null;
};

export default StoryComponent;
