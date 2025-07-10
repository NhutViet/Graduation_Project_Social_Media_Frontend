import React, {useState, useRef, useEffect} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useTheme} from '../../util/ThemeContext';
import UserInfoStyles from '../../StyleSheet/UserInfoStyles';
import {Colors} from '../../../assets/color/Colors';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import BottomSheetNotification, {
  SwitchOption,
} from '../../../components/BottomSheetNotification';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {RootStackParamList} from '../../Navigation/AppNavigation';
import ModalTheme from '../Message/components/ModalTheme';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../services/store';
import {updateRoomTheme} from '../../../services/roomRedux/roomSlice';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

import {
  ArrowLeft,
  User,
  Search,
  Bell,
  MoreHorizontal,
  Palette,
  Shield,
  Users,
  ChevronRight,
  Repeat,
  Image as ImageIcon,
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width - 8;
const initialLayout = {width: Dimensions.get('window').width};

export const UserInfo = () => {
  const [index, setIndex] = useState(0);
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'InfoUser'>>();
  const roomId = route?.params?.roomId;
  const img1 = route?.params?.img1;
  const nameChat = route?.params?.nameChat;
  const dispatch = useDispatch<AppDispatch>();
  const animatedLeftValue = useRef(new Animated.Value(0)).current;
  const [visibleThemeModal, setVisibleThemeModal] = useState(false);
  const styles = UserInfoStyles(theme);
  const color = Colors[theme];

  useEffect(() => {
    Animated.timing(animatedLeftValue, {
      toValue: (screenWidth / 2) * index,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [index]);

  const sheetRef = useRef<Modalize>(null);
  const [msgNotif, setMsgNotif] = useState(false);
  const [callNotif, setCallNotif] = useState(false);
  const [previewNotif, setPreviewNotif] = useState(false);

  const notificationOptions: SwitchOption[] = [
    {
      id: 'msg',
      label: 'Tắt thông báo tin nhắn',
      description: '',
      value: msgNotif,
      onValueChange: setMsgNotif,
    },
    {
      id: 'call',
      label: 'Tắt thông báo cuộc gọi',
      description: '',
      value: callNotif,
      onValueChange: setCallNotif,
    },
    {
      id: 'preview',
      label: 'Xem trước thông báo',
      description: 'Hiển thị tên và tin nhắn trên thông báo',
      value: previewNotif,
      onValueChange: setPreviewNotif,
    },
  ];

  const openNotifications = () => sheetRef.current?.open();
  const closeNotifications = () => sheetRef.current?.close();

  const [routes] = useState([
    {key: 'tab1', title: 'First'},
    {key: 'tab2', title: 'Second'},
  ]);

  const Header = () => (
    <View style={styles.container}>
      <View style={styles.blockHeader}>
        <TouchableOpacity style={styles.blockImg}>
          <Image source={{uri: img1}} style={styles.imgUser} />
        </TouchableOpacity>
        <Text style={styles.nameUser}>{nameChat}</Text>
      </View>
      <TouchableOpacity
        style={styles.iconBack}
        onPress={() => navigation.goBack()}>
        <ArrowLeft size={22} color={color.text} />
      </TouchableOpacity>

      <View style={styles.featureContainer}>
        <View style={styles.blockFeature}>
          <TouchableOpacity>
            <User size={22} color={color.text} />
          </TouchableOpacity>
          <Text style={styles.text}>Trang tài khoản</Text>
        </View>
        <View style={styles.blockFeature}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchMessages', {userId: 1})}>
            <Search size={22} color={color.text} />
          </TouchableOpacity>
          <Text style={styles.text}>Tìm kiếm tin nhắn</Text>
        </View>
        <View style={styles.blockFeature}>
          <TouchableOpacity onPress={openNotifications}>
            <Bell size={22} color={color.text} />
          </TouchableOpacity>
          <Text style={styles.text}>Tắt thông báo</Text>
        </View>
        <View style={styles.blockFeature}>
          <TouchableOpacity>
            <MoreHorizontal size={22} color={color.text} />
          </TouchableOpacity>
          <Text style={styles.text}>Thêm tùy chọn</Text>
        </View>
      </View>

      <View style={styles.tab2Container}>
        {[
          {icon: <Palette size={22} color={color.text} />, label: 'Chủ đề'},
          {
            icon: <Shield size={22} color={color.text} />,
            label: 'Quyền riêng tư và bảo mật',
          },
          {
            icon: <Users size={22} color={color.text} />,
            label: 'Tạo nhóm trò chuyện',
          },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.row}
            onPress={() => {
              if (i === 0) setVisibleThemeModal(true);
              else if (i === 2) navigation.navigate('CreateGroupScreen');
            }}>
            <View style={styles.infoRowContainer}>
              {item.icon}
              <Text style={styles.nameUser}>{item.label}</Text>
            </View>
            <ChevronRight size={22} color={color.text} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={{width: screenWidth / 3, height: screenWidth / 3, margin: 1}}>
      <Image source={{uri: item}} style={styles.image} />
    </TouchableOpacity>
  );

  const image1 = new Array(16).fill(
    'https://i.pinimg.com/736x/98/fb/d1/98fbd18bbfca43c717156470a23274b1.jpg',
  );
  const image2 = new Array(16).fill(
    'https://i.pinimg.com/736x/a4/2d/57/a42d57a76cc7d80def8d110b9ab1420d.jpg',
  );

  const Tab1 = () => (
    <FlatList
      data={image1}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      numColumns={3}
      contentContainerStyle={{padding: 1}}
      showsVerticalScrollIndicator={false}
    />
  );

  const Tab2 = () => (
    <FlatList
      data={image2}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      numColumns={3}
      contentContainerStyle={{padding: 1}}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderScene = SceneMap({
    tab1: Tab1,
    tab2: Tab2,
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <Header />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={() => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: color.background,
              paddingVertical: 10,
              borderTopWidth: 0.5,
              borderColor: color.gray,
              height: 40,
            }}>
            {[Repeat, ImageIcon].map((Icon, i) => (
              <TouchableOpacity
                key={i}
                style={{width: 20, height: 20, alignItems: 'center'}}
                onPress={() => setIndex(i)}>
                <Icon size={22} color={color.text} />
              </TouchableOpacity>
            ))}
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 0,
                left: animatedLeftValue,
                width: '50%',
                height: 2,
                backgroundColor: color.text,
              }}
            />
          </View>
        )}
      />
      <ModalTheme
        visible={visibleThemeModal}
        onClose={() => setVisibleThemeModal(false)}
        onSelect={selectedBackground => {
          dispatch(updateRoomTheme({roomId, theme: selectedBackground}))
            .unwrap()
            .then(() =>
              GlobalAlertManager.show('Thành công', 'Đã cập nhật chủ đề'),
            )
            .catch(() =>
              GlobalAlertManager.show('Thất bại', 'Cập nhật chủ đề thất bại'),
            );
          setVisibleThemeModal(false);
        }}
      />
      <Portal>
        <Modalize
          ref={sheetRef}
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 18,
          }}
          handleStyle={{
            backgroundColor: color.text,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          adjustToContentHeight>
          <BottomSheetNotification
            title="Thông báo"
            options={notificationOptions}
            onClose={closeNotifications}
          />
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
};
