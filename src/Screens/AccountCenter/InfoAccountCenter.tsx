import {Colors} from '@assets/color/Colors';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../../../src/Navigation/AppNavigation';
import {useTheme} from '../../../src/util/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {removeLoggedInUser} from '@services/userRedux/userReducer';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {RootState, AppDispatch} from '@services/store';
import {fetchLogin, fetchLogout} from '@services/userRedux/userSlice';
import {resetBookmarkState} from '@services/bookmarkRedux/bookmarkReducer';
import {resetReaction} from '@services/reactionRedux/reactionReducer';
import messaging from '@react-native-firebase/messaging';
import {ArrowLeft} from 'lucide-react-native';

type InfoAccountCenterRouteProp = RouteProp<
  RootStackParamList,
  'InfoAccountCenter'
>;

const InfoAccountCenter = () => {
  const route = useRoute<InfoAccountCenterRouteProp>();
  const {user} = route.params;
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user?.user);

  const changeAccount = async () => {
    let fcmToken = '';

    try {
      fcmToken = await messaging().getToken();
    } catch (err) {
      console.warn('Lấy FCM token thất bại:', err);
    }

    await dispatch(fetchLogout());
    const resultAction = await dispatch(
      fetchLogin({email: user.email, password: user.password, fcmToken}),
    );

    if (fetchLogin.fulfilled.match(resultAction)) {
      GlobalAlertManager.show(
        'Thành công',
        'Chuyển đổi tài khoản thành công',
        () => {
          navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
        },
      );
    } else {
      GlobalAlertManager.show(
        'Thất bại',
        resultAction.payload?.message || 'Chuyển đổi tài khoản thất bại',
      );
    }
  };

  const delAccount = async () => {
    dispatch(removeLoggedInUser(user._id));
    if (currentUser?._id === user._id) {
      GlobalAlertManager.show(
        'Đã xoá tài khoản',
        'Tài khoản đã được xoá khỏi thiết bị',
        () => {
          dispatch(fetchLogout());
          dispatch(resetBookmarkState());
          dispatch(resetReaction());
          navigation.reset({index: 0, routes: [{name: 'SwitchAccount'}]});
        },
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: color.background}]}>
      <TouchableOpacity
        style={styles.iconBack}
        onPress={() => {
          navigation.goBack();
        }}>
        <ArrowLeft size={22} color={color.text} />
      </TouchableOpacity>
      <View style={styles.blockImage}>
        <Image source={{uri: user.profilePic}} style={styles.img} />
      </View>
      <Text style={[styles.name, {color: color.text}]}>{user.username}</Text>
      <Text style={[styles.text, {color: color.text}]}>{user.email}</Text>
      <Text style={[styles.text, {color: color.text}]}>Cirla</Text>
      {!(currentUser?._id === user._id) && (
        <TouchableOpacity
          style={[styles.btn, {borderColor: 'blue'}]}
          onPress={() => {
            changeAccount();
          }}>
          <Text style={[styles.textBtn, {color: 'blue'}]}>
            Chuyển đổi tài khoản
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.btn, {borderColor: 'red'}]}
        onPress={() => {
          delAccount();
        }}>
        <Text style={[styles.textBtn, {color: 'red'}]}>
          Xoá tài khoản khỏi thiết bị
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InfoAccountCenter;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  blockImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 60,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    alignSelf: 'center',
  },
  btn: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textBtn: {
    fontSize: 14,
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
});
