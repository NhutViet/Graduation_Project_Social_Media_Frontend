import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../assets/color/Colors';

const {width} = Dimensions.get('window');

export const TagSoStyles = (theme: 'light' | 'dark') => {
  const colors = Colors[theme];
  return StyleSheet.create({
    imgContainer: {
      width: width,
      height: 480,
      marginBottom: 15,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderBottomColor: colors.border,
      borderWidth: 0.5,
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
    },
    textBtn: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.primary,
    },
    textNoti: {
      marginVertical: 30,
      textAlign: 'center',
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '400',
    },
    btn: {
      position: 'absolute',
      right: 10,
    },
    btnAdd: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      borderColor: colors.text,
      borderWidth: 1,
      borderRadius: 10,
      marginHorizontal: 20,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    search: {
      fontSize: 14,
      color: colors.text,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderColor: colors.textSecondary,
      borderWidth: 0.8,
      flex: 1,
      borderRadius: 10,
    },
    RowSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 15,
      marginHorizontal: 24,
      gap: 10,
    },
  });
};
