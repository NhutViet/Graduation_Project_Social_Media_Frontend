import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

interface HistoryItemProps {
  name: string;
  onPress: () => void;
  onDelete: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ name, onPress, onDelete }) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
      }}>
      <TouchableOpacity onPress={onPress} style={styles.touchableRow}>
        <View style={{padding: 10,
            borderColor: color.gray,
            borderWidth: 1,
            marginRight: 15,
            borderRadius: 50,}}>
        <Image
          source={require('../../../../assets/icon/search.png')}
          style={{
            width: 15,
            height: 15,
            resizeMode: 'contain',
            tintColor: color.text,
          }}
        />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: color.text,
            fontWeight: '500',
            flex: 1,
          }}>
          {name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Image
          source={require('../../../../assets/icon/closer.png')}
          style={{
            width: 10,
            height: 10,
            resizeMode: 'contain',
            tintColor: color.text,
          }}
        />
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
   icon: {
     width: 15,
     height: 15,
     resizeMode: 'contain',
   },
   text: {
     fontSize: 12,
     fontWeight: '500',
   },
   deleteButton: {
     paddingVertical: 10,
     paddingLeft: 10,
   },
   deleteIcon: {
     width: 10,
     height: 10,
     resizeMode: 'contain',
   },
 });
