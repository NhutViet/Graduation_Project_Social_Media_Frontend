import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../assets/color/Colors';
import {useTheme} from '../util/ThemeContext';

export const BlockedAccountsStyles = (theme: 'light' | 'dark') => {
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
      paddingHorizontal: 24,
      paddingVertical: 10,
      marginTop: 10,
      borderBottomColor: color.gray,
      borderBottomWidth: 1,
    },
    icon: {
      width: 24,
      height: 14,
      resizeMode: 'contain',
      tintColor: color.text,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: color.text,
    },
    modal: {
      backgroundColor: theme == 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255, 255, 255, 0.5)',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContainer: {
      backgroundColor: color.background,
      borderRadius: 20,
      overflow: 'hidden',
      width: '80%'
    },
    notiTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: color.text,
      textAlign: 'center',
      marginTop: 30,
    },
    notiText: {
      fontSize: 14,
      color: color.text,
      textAlign: 'center',
      marginTop: 15,
      marginBottom: 30,
      paddingHorizontal: 20,
      fontWeight: '400'
    },
    btnModal: {
      backgroundColor: color.background,
      width: '100%',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: color.lightDark,
      borderTopColor: color.lightDark,
      borderTopWidth: 1
    },
    btnCance: {
      backgroundColor: color.background,
      width: '100%',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
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
      color: color.text,
    },
  });
};
