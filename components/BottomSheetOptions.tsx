import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useBottomSheetStyles} from '../src/StyleSheet/BottomSheetStyles';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';

export interface OptionItem {
  id: string;
  icon: any;
  label: string;
  onPress: () => void;
  labelColor?: string;
}

export interface BottomSheetOptionsProps {
  topOptions: OptionItem[];
  // array of groups for vertical lists
  listOptionGroups: OptionItem[][];
  handleHidePost: () => void;
  onClose: () => void;
}

export const BottomSheetOptions: React.FC<BottomSheetOptionsProps> = ({
  topOptions,
  listOptionGroups,
  handleHidePost,
  onClose,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();
  const spacing = Colors.spacing;

  const handlePress = (item: OptionItem) => {
    if (item.id === 'hide') {
      handleHidePost();
    } else {
      item.onPress();
    }
    onClose();
  };

  return (
    <View style={styles.sectionContainer}>
      {/* Horizontal row */}
      {topOptions.length > 0 && (
        <View style={styles.horizontalContainer}>
          {topOptions.map((item, idx) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.horizontalButton}
                onPress={() => handlePress(item)}>
                <Image
                  source={item.icon}
                  style={[styles.topIcon, {tintColor: color.text}]}
                  resizeMode="contain"
                />
                <Text style={[styles.topLabel, {color: palette.text}]}>
                  {item.label}
                </Text>
              </TouchableOpacity>

              {/* only render an invisible spacer if this isn’t the last item */}
              {idx < topOptions.length - 1 && (
                <View style={{width: spacing.s}} />
              )}
            </React.Fragment>
          ))}
        </View>
      )}

      {/* Vertical lists */}
      {listOptionGroups.map((group, idx) => (
        <View key={idx} style={styles.verticalSectionContainer}>
          {group.map((item, i) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handlePress(item)}>
                <Image
                  source={item.icon}
                  style={[
                    styles.listIcon,
                    {tintColor: item.labelColor ?? color.text},
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.listLabel,
                    {color: item.labelColor || palette.text},
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
              {/* Separator except after last item */}
              {i < group.length - 1 && <View style={styles.listSeparator} />}
            </React.Fragment>
          ))}
        </View>
      ))}
    </View>
  );
};

export default BottomSheetOptions;
