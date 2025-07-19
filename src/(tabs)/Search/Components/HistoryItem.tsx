import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {Search, X} from 'lucide-react-native';

interface HistoryItemProps {
  name: string;
  onPress: () => void;
  onDelete: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({name, onPress, onDelete}) => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.touchableRow}>
        <View style={[styles.iconWrapper, {borderColor: color.gray}]}>
          <Search size={22} color={color.text} />
        </View>
        <Text style={[styles.text, {color: color.text, flex: 1}]}>{name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <X size={20} color={color.text} />
      </TouchableOpacity>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  touchableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 15,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
});
