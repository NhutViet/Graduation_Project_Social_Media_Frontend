import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {Ban, BellOff, Settings2} from 'lucide-react-native';

interface ModalIsBlockProps {
  uri: string;
  handle: string;
  onHandleBlock: () => void;
}

const ModalIsBlock = (props: ModalIsBlockProps) => {
  const {uri, handle, onHandleBlock} = props;
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <View style={[{backgroundColor: color.background}]}>
      <View style={{alignItems: 'center'}}>
        <View style={[styles.indicator, {backgroundColor: color.lightDark}]} />
      </View>
      <View style={styles.topContainer}>
        <Image source={{uri: uri}} style={styles.image} />
        <Text style={[styles.question, {color: color.text}]}>
          Chặn {handle}?
        </Text>
        <Text style={[styles.note, {color: color.textSecondary}]}>
          Điều này cũng sẽ chặn bất kỳ tài khoản nào khác mà họ có hoặc có thể
          tạo trong tương lai.
        </Text>
        <View style={styles.notiContainer}>
          <Ban size={22} color={color.textSecondary} style={styles.icon} />
          <Text style={[styles.noti, {color: color.text}]}>
            Họ sẽ không thể nhắn tin cho bạn hoặc tìm thấy hồ sơ hay nội dung
            của bạn trên Cirla.
          </Text>
        </View>
        <View style={styles.notiContainer}>
          <BellOff size={22} color={color.textSecondary} style={styles.icon} />
          <Text style={[styles.noti, {color: color.text}]}>
            Họ sẽ không được thông báo rằng bạn đã chặn họ.
          </Text>
        </View>
        <View style={styles.notiContainer}>
          <Settings2
            size={22}
            color={color.textSecondary}
            style={styles.icon}
          />
          <Text style={[styles.noti, {color: color.text}]}>
            Bạn có thể bỏ chặn họ bất cứ lúc nào trong phần Cài đặt.
          </Text>
        </View>
      </View>
      <View style={[styles.btnContainer, {borderTopColor: color.gray}]}>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: color.primary}]}
          onPress={onHandleBlock}>
          <Text
            style={[
              styles.noti,
              {color: color.background, fontWeight: 'bold'},
            ]}>
            Chặn
          </Text>
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
    width: 20,
    height: 20,
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
    alignItems: 'center',
  },
  indicator: {
    width: 50,
    height: 4,
    borderRadius: 10,
    marginTop: 15,
  },
});
