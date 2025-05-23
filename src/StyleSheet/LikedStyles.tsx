import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../assets/color/Colors';

export const LikedStyles = (theme: 'light' | 'dark') => {
    const color = Colors[theme];
  return StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 10,
        borderBottomColor: color.gray,
        borderBottomWidth: 1,
    },
    iconBack: {
        width: 14,
        resizeMode: 'contain',
        tintColor: color.text,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.text,
    },
    cancel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.primary,
    },
    textFilter: {
        fontSize: 12,
        fontWeight: 'bold',
        color: color.text,
    },
    filterContainer: {
        backgroundColor: color.gray,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    unlike: {
        fontSize: 16,
        color: color.error,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    horiContainer: {
        paddingLeft: 24,
        paddingVertical: 10,
    },
  });
}