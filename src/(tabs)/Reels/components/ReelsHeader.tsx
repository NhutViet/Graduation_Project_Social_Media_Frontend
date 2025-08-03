import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '@assets/color/Colors';

const ReelsHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Reels</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 10,
    zIndex: 1,
    padding: 20,
    backgroundColor: Colors.transparent,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
});

export default ReelsHeader;
