import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useBottomSheetStyles} from '../src/StyleSheet/BottomSheetStyles';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import { LucideProps } from 'lucide-react-native'

export interface ConfigOption {
  id: string
  icon: React.ComponentType<LucideProps>
  label: string
  labelColor?: string
}

export interface BottomSheetOptionsProps {
  topOptions: ConfigOption[];
  isBookmarked?: boolean;
  listOptionGroups: ConfigOption[][];
  onSelect: (id: string) => void;
}

const BottomSheetOptions: React.FC<BottomSheetOptionsProps> = ({
  topOptions,
  isBookmarked,
  listOptionGroups,
  onSelect,
}) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const styles = useBottomSheetStyles();
  const spacing = Colors.spacing;

  const handlePress = (id: string) => {
    onSelect(id);
  };

  return (
    <View style={styles.sectionContainer}>
      {/* Horizontal row */}
      {topOptions.length > 0 && (
        <View style={styles.horizontalContainer}>
           {topOptions.map((opt, idx) => {
            const Icon = opt.icon
            const isBm = opt.id === 'bookmark' && isBookmarked
            return (
              <React.Fragment key={opt.id}>
                <TouchableOpacity
                  style={styles.horizontalButton}
                  onPress={() => handlePress(opt.id)}
                >
                  <Icon
                    size={24}
                    strokeWidth={2}
                    color={isBm ? "black" : palette.text}
                    fill={isBm ? "black" : 'none'}
                  />
                  <Text style={[styles.topLabel, { color: palette.text }]}>
                    {isBm ? 'Đã lưu' : opt.label}
                  </Text>
                </TouchableOpacity>
                {idx < topOptions.length - 1 && <View style={{ width: Colors.spacing.s }} />}
              </React.Fragment>
            )
          })}
        </View>
      )}

      {/* Vertical lists */}
      {listOptionGroups.map((group, gIdx) => (
        <View key={gIdx} style={styles.verticalSectionContainer}>
          {group.map((opt, idx) => {
            const Icon = opt.icon
            const isReport = opt.id === 'report'
            return (
              <React.Fragment key={opt.id}>
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handlePress(opt.id)}
                >
                  <Icon
                    size={20}
                    strokeWidth={2}
                    color={opt.labelColor ?? palette.text}
                    style={{marginRight: spacing.m}}
                  />
                  <Text
                    style={[
                      styles.listLabel,
                      { color: opt.labelColor || palette.text },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
                {idx < group.length - 1 && <View style={styles.listSeparator} />}
              </React.Fragment>
            )
          })}
        </View>
      ))}
    </View>
  );
};

export default React.memo(BottomSheetOptions);