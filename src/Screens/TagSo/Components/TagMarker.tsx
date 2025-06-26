import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Draggable from 'react-native-draggable';
import {TagUser, TaggedMedia} from '../../TagSo';

type TagMarkerProps = {
  tag: TagUser;
  tagIndex: number;
  mediaIndex: number;
  screenWidth: number;
  imageHeight: number;
  media?: TaggedMedia[];
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onUpdatePosition?: (
    mediaIndex: number,
    tagIndex: number,
    position: {x: number; y: number},
  ) => void;
};

const TagMarker = ({
  tag,
  tagIndex,
  mediaIndex,
  screenWidth,
  imageHeight,
  onDragEnd,
  onDragStart,
  onUpdatePosition,
}: TagMarkerProps) => {
  const [position, setPosition] = useState<{x: number; y: number} | null>(null);
  const positionRef = useRef<{x: number; y: number}>({x: 0, y: 0});

  useEffect(() => {
    const x = tag.position.x * screenWidth;
    const y = tag.position.y * imageHeight;

    // Reset vị trí mỗi lần tag thay đổi
    const newPos = {x, y};
    positionRef.current = newPos;
    setPosition(newPos);
  }, [tag.user._id, tag.position.x, tag.position.y, screenWidth, imageHeight]);

  if (!position) return null; // Chưa có vị trí thì không render Draggable

  return (
    <Draggable
      x={position.x}
      y={position.y}
      onDrag={() => {
        onDragStart?.();
      }}
      onDragRelease={(e, gestureState) => {
        onDragEnd?.();

        const newX = positionRef.current.x + gestureState.dx;
        const newY = positionRef.current.y + gestureState.dy;

        positionRef.current = {x: newX, y: newY};

        const percentX = Math.max(0, Math.min(1, newX / screenWidth));
        const percentY = Math.max(0, Math.min(1, newY / imageHeight));

        onUpdatePosition?.(mediaIndex, tagIndex, {x: percentX, y: percentY});
      }}>
      <View style={styles.textInputContainer}>
        <Text style={styles.captionText}>@{tag.user.handleName}</Text>
      </View>
    </Draggable>
  );
};

export default React.memo(TagMarker);

const styles = StyleSheet.create({
  textInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  captionText: {
    color: '#fff',
    fontSize: 12,
  },
});
