import React, { forwardRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
// import { Modalize } from 'react-native-modalize';
import { useBottomSheetStyles } from '../src/StyleSheet/BottomSheetStyles';
import { useTheme } from '../src/util/ThemeContext';
import { Colors } from '../assets/color/Colors';

export interface OptionItem {
  icon: any;
  label: string;
  onPress: () => void;
  labelColor?: string;
}

export interface BottomSheetOptionsProps {
  topOptions: OptionItem[];
  listOptions: OptionItem[];
  onClose: () => void;
}

export const BottomSheetOptions: React.FC<BottomSheetOptionsProps> = ({
  topOptions,
  listOptions,
  onClose
}) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();

    const renderTopButton: ListRenderItem<OptionItem> = ({ item }) => (
      <TouchableOpacity
        style={[styles.topButton, { backgroundColor: palette.modal }]}
        onPress={() => {
          item.onPress();
          onClose();
        }}
      >
        <Image source={item.icon} style={styles.topIcon} resizeMode="contain" />
        <Text style={[styles.topLabel, { color: palette.text }]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );

    const renderListButton: ListRenderItem<OptionItem> = ({ item }) => (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          item.onPress();
          onClose();
        }}
      >
        <Image source={item.icon} style={styles.listIcon} resizeMode="contain" />
        <Text style={[styles.listLabel, { color: item.labelColor || palette.text }]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );

    return (
    <>
      <View style={styles.topRowContainer}>
        <FlatList
          data={topOptions}
          keyExtractor={item => item.label}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topListContent}
          renderItem={renderTopButton}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={listOptions}
          keyExtractor={item => item.label}
          renderItem={renderListButton}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        />
      </View>
    </>
  );
 }
 
export default BottomSheetOptions;