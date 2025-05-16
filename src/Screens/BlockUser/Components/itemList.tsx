import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';

const ItemList = (props: any) => {
    const {uri, handle, name, onhandleItem, onhandleBlock} = props;
    const {theme} = useTheme();
    const colors = Colors[theme];
  return (
    <TouchableOpacity onPress={onhandleItem} style={styles.container}>
        <Image source={{uri: uri}} style={styles.image}/>
        <View style={styles.midContainer}>
            <Text style={[styles.handle, {color: colors.text, textAlign: 'left'}]} numberOfLines={1} ellipsizeMode='tail'>{handle}</Text>
            <Text style={[styles.name, {color: colors.lightDark}]} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
        </View>
        <TouchableOpacity onPress={onhandleBlock} style={styles.blockBox}>
            <Text style={[styles.handle, {color: colors.text}]}>Block</Text>
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default ItemList

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