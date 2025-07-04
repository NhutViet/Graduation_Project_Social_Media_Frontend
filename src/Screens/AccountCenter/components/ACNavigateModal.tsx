import {Colors} from '@assets/color/Colors';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useTheme} from '../../../../src/util/ThemeContext';
import {useNavigation} from '@react-navigation/native';

export type ACNavigateRef = {
  open: () => void;
  close: () => void;
};

const height = Dimensions.get('window').height * 0.35;

const ACNavigateModal = forwardRef<ACNavigateRef>((_, ref) => {
  const modalizeRef = useRef<Modalize>(null);
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation<any>();

  useImperativeHandle(ref, () => ({
    open: () => modalizeRef.current?.open(),
    close: () => modalizeRef.current?.close(),
  }));

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        modalHeight={height}
        handlePosition="inside"
        modalStyle={[styles.modal, {backgroundColor: color.background}]}
        handleStyle={[styles.handle, {backgroundColor: color.text}]}>
        <View style={styles.container}>
          <Text style={[styles.title, {color: color.text}]}>
            Thêm tài khoản
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              navigation.navigate('SwitchAccount');
              modalizeRef.current?.close();
            }}>
            <Text style={[{color: '#007AFF'}, styles.text]}>
              Đăng nhập vào tài khoản hiện có
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, {borderColor: color.text, marginTop: 20}]}
            onPress={() => {
              navigation.navigate('Register');
              modalizeRef.current?.close();
            }}>
            <Text style={[{color: color.text}, styles.text]}>
              Tạo tài khoản mới
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </Portal>
  );
});

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    height: 5,
    width: 40,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 2.5,
  },
  container: {
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  btn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ACNavigateModal;
