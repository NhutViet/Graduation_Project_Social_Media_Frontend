import React from 'react';
import {View, Text, Image, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {useBottomSheetStyles} from '../src/StyleSheet/BottomSheetStyles';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';

export interface ConfigOption {
  id: string;
  icon: ImageSourcePropType;
  label: string;
  labelColor?: string;
}

export interface BottomSheetOptionsProps {
  topOptions: ConfigOption[];
  isBookmarked?: boolean;
  listOptionGroups: ConfigOption[][];
  onSelect: (id: string) => void;
  onBookmarkPress: () => void;
}

const BottomSheetOptions: React.FC<BottomSheetOptionsProps> = ({
  topOptions,
  isBookmarked,
  listOptionGroups,
  onSelect,
  onBookmarkPress
}) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();

  const handlePress = (id: string) => {
    onSelect(id);
  };

  return (
    <View style={styles.sectionContainer}>
      {/* Horizontal row */}
      {topOptions.length > 0 && (
        <View style={styles.horizontalContainer}>
          {topOptions.map((opt, idx) => (
            <React.Fragment key={opt.id}>
              <TouchableOpacity
                style={styles.horizontalButton}
                onPress={onBookmarkPress}>
                <Image
                  source={isBookmarked && opt.id === 'bookmark' ? require('../assets/icon/bookmark_fill.png') : opt.icon}
                  style={[styles.topIcon, { tintColor: isBookmarked && opt.id === 'bookmark' ? '#F2C641' : palette.text }]}
                  resizeMode="contain"
                />
                <Text style={[styles.topLabel, { color: palette.text }]}>  
                  {isBookmarked && opt.id === 'bookmark' ? 'Đã lưu' : opt.label}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      )}

      {/* Vertical lists */}
      {listOptionGroups.map((group, gIdx) => (
        <View key={gIdx} style={styles.verticalSectionContainer}>
          {group.map((opt, idx) => (
            <React.Fragment key={opt.id}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handlePress(opt.id)}>
                <Image
                  source={opt.icon}
                  style={[
                    styles.listIcon,
                    { tintColor: opt.labelColor ?? palette.text },
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.listLabel,
                    { color: opt.labelColor || palette.text },
                  ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
              {/* separator if not last item */}
              {idx < group.length - 1 && (
                <View style={styles.listSeparator} />
              )}
            </React.Fragment>
          ))}
        </View>
      ))}
    </View>
  );
};

export default React.memo(BottomSheetOptions);