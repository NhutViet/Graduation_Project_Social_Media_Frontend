import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

type Tag = {
  userId: string;
  handleName: string;
  positionX: number;
  positionY: number;
};

type TagMarkerProps = {
  tag: Tag;
  screenWidth: number;
  imageHeight: number;
  onPress?: (userId: string) => void;
};

const TagMarker = ({tag, screenWidth, imageHeight, onPress}: TagMarkerProps) => {
  const x = tag.positionX * screenWidth;
  const y = tag.positionY * imageHeight;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(tag.userId)}
      activeOpacity={0.8}
      style={[
        styles.marker,
        {
          left: x,
          top: y,
        },
      ]}>
      <View style={styles.tagContainer}>
        <Text style={styles.text}>@{tag.handleName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TagMarker);

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    zIndex: 10,
  },
  tagContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
  },
});
