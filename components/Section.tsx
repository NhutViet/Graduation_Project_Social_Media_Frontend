import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';

type SectionProps = {
  title: string;
  iconLeft: React.ReactNode;
  iconRight?: React.ReactNode;
  func?: () => void;
  backData?: string;
};

const Section = ({
  title,
  iconLeft,
  iconRight,
  func,
  backData,
}: SectionProps) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <TouchableOpacity style={styles.container} onPress={func}>
      <View style={styles.left}>
        {iconLeft}
        <Text style={[styles.title, {color: color.text}]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        {backData && (
          <Text style={[styles.backData, {color: color.textSecondary}]}>
            {backData}
          </Text>
        )}
        {iconRight}
      </View>
    </TouchableOpacity>
  );
};

export default Section;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    flexShrink: 1,
  },
  backData: {
    fontSize: 16,
  },
});
