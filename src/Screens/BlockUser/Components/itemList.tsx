import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';

interface ItemProps {
  uri: string;
  handle: string;
  name: string;
  onhandleItem: () => void;
  onhandleBlock: () => void;
}

const ItemList: React.FC<ItemProps> = ({ uri, handle, name, onhandleItem, onhandleBlock }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <TouchableOpacity onPress={onhandleItem} style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      <View style={styles.midContainer}>
        <Text style={[styles.handle, { color: colors.text }]} numberOfLines={1} ellipsizeMode='tail'>
          {handle}
        </Text>
        <Text style={[styles.name, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode='tail'>
          {name}
        </Text>
      </View>
      <TouchableOpacity onPress={onhandleBlock} style={[styles.blockBox, { borderColor: colors.text }]}>  
        <Text style={[styles.handle, { color: colors.text }]}>Chặn</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ItemList;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: 50, height: 50,
        resizeMode: 'cover',
        borderRadius: 200,
    },
    midContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: '400'
    },
    handle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    blockBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 5,
    }
})