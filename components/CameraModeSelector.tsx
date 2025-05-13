import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useCameraStyles } from '../src/StyleSheet/CameraStyles';

export type ModeSelectorProps = {
  modes: string[];
  selected: string;
  onSelect: (mode: string) => void;
};

const ModeSelector: React.FC<ModeSelectorProps> = ({ modes, selected, onSelect }) => {
  const styles = useCameraStyles();
  return (
    <View style={styles.cameraModeContainer}>
      <FlatList
        data={modes}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isActive = item === selected;
          return (
            <TouchableOpacity
              style={[styles.itemContainer, isActive && styles.itemActive]}
              onPress={() => onSelect(item)}
            >
              <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ModeSelector;