import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';

const ModalIsBlock = (props: any) => {
  const {uri, handle, onHandleBlock} = props;
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <View style={[{backgroundColor: color.background}]}>
        <View style={{alignItems: 'center'}}><View style={[styles.indicator, {backgroundColor: color.lightDark}]}/></View>
      <View style={styles.topContainer}>
        <Image source={{uri: uri}} style={styles.image}/>
        <Text style={[styles.question, {color: color.text}]}>Block {handle}?</Text>
        <Text style={[styles.note, {color: color.lessBlack}]}>
          This will also block any other accounts they may have or create in the
          future
        </Text>
        <View style={styles.notiContainer}>
          <Image source={require('../../../../assets/icon/no_comment.png')} style={styles.icon}/>
          <Text style={[styles.noti, {color: color.text}]}>
            They won't be able to message you or find your profile or content on
            Instagram.
          </Text>
        </View>
        <View style={styles.notiContainer}>
          <Image source={require('../../../../assets/icon/no_notification.png')} style={styles.icon}/>
          <Text style={[styles.noti, {color: color.text}]}>They won't be notified that you blocked them.</Text>
        </View>
        <View style={styles.notiContainer}>
          <Image source={require('../../../../assets/icon/setting.png')} style={styles.icon}/>
          <Text style={[styles.noti, {color: color.text}]}>You can unblock them anytime in Settings.</Text>
        </View>
      </View>
      <View style={[styles.btnContainer, {borderTopColor: color.gray}]}>
        <TouchableOpacity style={[styles.btn, {backgroundColor: color.primary}]} onPress={onHandleBlock}>
          <Text style={[styles.noti, {color: color.background, fontWeight: 'bold'}]}>Block</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalIsBlock;

const styles = StyleSheet.create({
  question: {
    fontSize: 25,
    fontWeight: 'bold',
    width: '100%',
    marginVertical: 10,
  },
  note: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'justify',
  },
  noti: {
    fontSize: 14,
    textAlign: 'justify',
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 200,
  },
  icon: {
    width: 25, height: 25,
    resizeMode: 'contain',
    marginRight: 20,
  },
  notiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  btnContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
  },
  topContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignItems: 'center'
  },
  indicator: {
    width: 50,
    height: 4,
    borderRadius: 10,
    marginTop: 15,
  },
});
