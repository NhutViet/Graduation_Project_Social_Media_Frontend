import React from 'react';
import {View, Text, Image} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Styles} from '../../../StyleSheet/Profile.Styles';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const StoryComponent = ({
  isPrivate,
  highlights,
}: {
  isPrivate: boolean;
  highlights: Array<{ id: string; image: string; title: string }>;
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const renderStoryItem = ({item}: any) => (
    <View key={item.id} style={Styles.styles.highlightItem}>
      <View style={Styles.styles.highlightImageContainer}>
        <Image
          source={{uri: item.image}}
          style={Styles.styles.highlightImage}
        />
      </View>
      <Text style={[Styles.styles.highlightTitle, {color: color.text}]}>
        {item.title}
      </Text>
    </View>
  );

  return isPrivate ? (
    <View style={Styles.styles.highlightsContainer}>
      <FlashList
        data={highlights}
        renderItem={renderStoryItem}
        estimatedItemSize={50}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  ) : null;
};

export default StoryComponent;
