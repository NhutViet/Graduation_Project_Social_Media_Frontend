import React, {memo} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Colors} from '@assets/color/Colors';
import {ChevronDown} from 'lucide-react-native';

const width = Dimensions.get('window').width;

const ReelsHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.rowContainer}>
        <Text style={styles.textHeader}>Reels</Text>
        <View style={styles.iconDownContainer}>
          <ChevronDown size={22} color={Colors.white} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: width,
    top: 10,
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
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(ReelsHeader);
