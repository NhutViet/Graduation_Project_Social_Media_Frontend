import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useBottomSheetStyles} from '../src/StyleSheet/BottomSheetStyles';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';

export interface ConfigOption {
  id: string;
  icon: any;
  label: string;
  labelColor?: string;
}

export interface BottomSheetOptionsProps {
  topOptions: ConfigOption[];
  listOptionGroups: ConfigOption[][];
  onSelect: (id: string) => void;
}

const BottomSheetOptions: React.FC<BottomSheetOptionsProps> = ({
  topOptions,
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
          {topOptions.map((opt, idx) => (
            <React.Fragment key={opt.id}>
              <TouchableOpacity
                style={styles.horizontalButton}
                onPress={() => handlePress(opt.id)}>
                <Image
                  source={opt.icon}
                  style={[styles.topIcon, { tintColor: palette.text }]}
                  resizeMode="contain"
                />
                <Text style={[styles.topLabel, { color: palette.text }]}>  
                  {opt.label}
                </Text>
              </TouchableOpacity>
              {/* only render an invisible spacer if this ain't the last item */}
              {idx < topOptions.length - 1 && <View style={{ width: spacing.s }} />}
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