import {Colors} from '@assets/color/Colors';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../src/util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@services/store';
import AccountCenterComponent from './components/AccountCenterComponent';

const AccountCenter = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation();
  const loggedInUsers = useSelector(
    (state: RootState) => state.user.loggedInUsers,
  );
  
  return (
    <View style={[styles.container, {backgroundColor: color.background}]}>
      <TouchableOpacity
        style={styles.iconBack}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          style={[styles.icon, {tintColor: color.text}]}
          source={require('../../../assets/icon/left.png')}
        />
      </TouchableOpacity>
      <Text style={[styles.title, {color: color.text}]}>Trang cá nhân</Text>
      <Text style={[styles.text, {color: color.text}]} numberOfLines={4}>
        Quản lý thông tin trên trang cá nhân và dùng chung thông tin trên Cirla.
        Bạn có thể thêm tài khoản bổ sung trang cá nhân
      </Text>
      <View style={[styles.body, {borderColor: color.text}]}>
        {loggedInUsers.map(user => (
          <AccountCenterComponent
            key={user._id}
            imageAccount={user.profilePic}
            nameAccount={user.username}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.btnAdd}>
        <Text style={styles.btn}>Thêm tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  iconBack: {
    width: 20,
    height: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 15,
  },
  body: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 20,
  },
  btnAdd: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    color: '#007AFF',
    fontSize: 15,
  },
});

export default AccountCenter;
