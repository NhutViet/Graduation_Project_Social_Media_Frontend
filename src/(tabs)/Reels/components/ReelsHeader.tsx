import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../assets/color/Colors';

const width = Dimensions.get('window').width;

const ReelsHeader = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.rowContainer}>
        <Text style={styles.textHeader}>Reels</Text>
        <View style={styles.iconDownContainer}>
          <Image
            style={styles.icon}
            source={require('../../../assets/icon/down.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: width,
    top: 0,
    zIndex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginRight: 8,
  },
  iconDownContainer: {
    width: 12,
    height: 12,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});

export default ReelsHeader;
