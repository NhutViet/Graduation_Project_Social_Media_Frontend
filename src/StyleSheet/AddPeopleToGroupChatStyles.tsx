import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../assets/color/Colors';

export const AddPeopleToGroupChatStyles = (theme: 'light' | 'dark') => {
    const colors = Colors[theme];
  return StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
        gap: 10,
    },
    iconBack: {
        width: 14,
        resizeMode: 'contain',
        tintColor: colors.text,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    invite: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.text,
    },
    textName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text,
    },
    icon: {
        width: 24, height: 24,
        resizeMode: 'contain',
        tintColor: colors.text,
    },
    input: {
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.lightDark,
        paddingHorizontal: 30,
        paddingVertical: 5,
        color: colors.text,
        flex: 1,
        borderRadius: 10,
    },
    iconCloser: {
        width: 10, height: 10,
        resizeMode: 'contain',
        tintColor: colors.white,
    },
    avatar: {
        width: 50, height: 50,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    max: {
        flex: 1,
    },
    circle: {
        width: 20, height: 20,
        backgroundColor: colors.transparent,
        borderColor: colors.lightDark,
        borderWidth: 1,
        borderRadius: 100,
    },
    tick: {
        width: 20, height: 20,
        tintColor: colors.primary,
        resizeMode: 'contain'
    },
    btnCopy: {
        backgroundColor: colors.gray,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    fit: {
        alignSelf: 'flex-start'
    },
    btnDelete: {
        position: 'absolute',
        top: 0, right: 0,
        borderRadius: 50,
        backgroundColor: colors.text,
        borderWidth: 2,
        borderColor: colors.background,
        width: 15, height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    iconDelete: {
        width: 6, height: 6,
        tintColor: colors.background
    },
    btnAdd: {
        backgroundColor: colors.primary,
        marginHorizontal: 24,
        marginVertical: 15,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
  });
}
