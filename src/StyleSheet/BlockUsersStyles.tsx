import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../assets/color/Colors';

export const BlockUsersStyles = (theme: 'light' | 'dark') => {
  const color = Colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 10,
      paddingHorizontal: 20,
      borderBottomColor: color.gray,
      borderBottomWidth: 0.5,
    },
    iconBack: {
      width: 20,
      resizeMode: 'contain',
      tintColor: color.text,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: color.text,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iconSearch: {
      width: 15,
      height: 15,
      resizeMode: 'contain',
      position: 'absolute',
      left: 35,
      tintColor: color.textSecondary,
    },
    inputBox: {
      backgroundColor: color.gray,
      fontSize: 14,
      paddingLeft: 40,
      paddingEnd: 20,
      flex: 1,
      borderRadius: 10,
      paddingVertical: 5,
      color: color.text,
    },
    cancel: {
      fontSize: 14,
      fontWeight: '400',
      marginLeft: 10,
      color: color.text,
    },
    notFound: {
      fontSize: 30,
      fontWeight: '500',
      textAlign: 'center',
      marginVertical: 100,
    },
    loaderOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: color.background,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
    },
  });
};
