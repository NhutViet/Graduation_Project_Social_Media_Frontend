import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {AddPeopleToGroupChatStyles} from '../../StyleSheet/AddPeopleToGroupChatStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';
import {ArrowLeft, Link2, Search, X, CheckCircle2} from 'lucide-react-native';
import {useDispatch} from 'react-redux';
import {addPeopleToGroupChat, getAvaibleFriends} from '@services/roomRedux/roomSlice';
import {AppDispatch} from '@services/store';

type UserType = {
  id: string;
  name: string;
  handle: string;
  uri: string;
};

export const AddPeopleToGroupChat = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [fullList, setFullList] = useState<UserType[]>([]);
  const [selected, setSelected] = useState<UserType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const {theme} = useTheme();
  const colors = Colors[theme];
  const styles = AddPeopleToGroupChatStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const roomId = (route.params as {roomId: string})?.roomId;
  const dispatch = useDispatch<AppDispatch>();

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    GlobalAlertManager.show('Thông báo', 'Đã sao chép văn bản');
  };

  useEffect(() => {
    if (roomId) {
      dispatch(getAvaibleFriends({roomId: roomId}))
        .unwrap()
        .then(
          (
            data: {
              username: string;
              handleName: string;
              profilePic: string;
              user_id?: string;
              isFollow: boolean;
              isCreated: boolean;
            }[],
          ) => {
            const formatted = data.map(
              (item: {
                username: string;
                handleName: string;
                profilePic: string;
                user_id?: string;
                isFollow: boolean;
                isCreated: boolean;
              }) => ({
                id: item.user_id || '',
                name: item.username,
                handle: item.handleName,
                uri: item.profilePic,
              }),
            );
            setUsers(formatted);
            setFullList(formatted);
          },
        )
        .catch((error: any) => {
          GlobalAlertManager.show(
            'Lỗi',
            error?.message || 'Không thể tải danh sách',
          );
        });
    }
  }, [roomId]);

  useEffect(() => {
    if (searchText === '') {
      setUsers(fullList);
    } else {
      const search = fullList.filter(
        user =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.handle.toLowerCase().includes(searchText.toLowerCase()),
      );
      setUsers(search);
    }
  }, [searchText, fullList]);

  const onHandleSelect = useCallback(
    (item: UserType) => {
      const isSelected = selected.some(prev => prev.id === item.id);
      if (isSelected) {
        const filter = selected.filter(prev => prev.id !== item.id);
        setSelected(filter);
      } else {
        setSelected(prev => [...prev, item]);
      }
    },
    [selected],
  );

  const onDeleteSelect = (item: UserType) => {
    const index = selected.findIndex(i => i.id === item.id);
    if (index !== -1) {
      selected.splice(index, 1);
      setSelected([...selected]);
    }
  };

  return (
    <SafeAreaView style={styles.constainer}>
      <View
        style={[
          styles.header,
          {borderBottomWidth: 1, borderBottomColor: colors.gray, marginTop: 10},
        ]}>
        <TouchableOpacity
          style={styles.iconBack}
          onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Thêm người</Text>
        <View style={styles.iconBack} />
      </View>

      <View style={styles.header}>
        <Link2 size={22} color={colors.text} style={styles.icon} />
        <View style={styles.max}>
          <Text style={styles.invite}>Liên kết mời</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.textName,
              {fontWeight: '400', color: colors.textSecondary},
            ]}>
            https://ig.me/ksjhdkjskbjhsbjkbvsjbvksjhdkjskbjhsbjkbvsjbv
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnCopy}
          onPress={() =>
            copyToClipboard(
              'https://ig.me/ksjhdkjskbjhsbjkbvsjbvksjhdkjskbjhsbjkbvsjbv',
            )
          }>
          <Text style={styles.textName}>Sao chép</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor={colors.lightDark}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Search
          size={22}
          color={colors.lightDark}
          style={[styles.iconBack, {position: 'absolute', left: 30}]}
        />
        {searchText !== '' && (
          <TouchableOpacity
            onPress={() => setSearchText('')}
            style={{
              position: 'absolute',
              right: 30,
              backgroundColor: colors.textSecondary,
              borderRadius: 20,
              padding: 1,
            }}>
            <X size={18} color={colors.background} style={styles.iconCloser} />
          </TouchableOpacity>
        )}
      </View>

      {selected.length > 0 && (
        <View style={styles.header}>
          <FlashList
            data={selected}
            estimatedItemSize={200}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            renderItem={({item}) => (
              <View style={{marginRight: 15}}>
                <Image
                  source={{uri: item.uri}}
                  style={[styles.avatar, {width: 60, height: 60}]}
                />
                <TouchableOpacity
                  onPress={() => onDeleteSelect(item)}
                  style={styles.btnDelete}>
                  <X
                    size={16}
                    color={colors.background}
                    style={styles.iconDelete}
                  />
                </TouchableOpacity>
              </View>
            )}
            extraData={selected}
          />
        </View>
      )}

      <Text style={[styles.title, styles.header]}>Gợi ý</Text>

      <View style={styles.constainer}>
        <FlashList
          data={users}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const isSelect = selected.some(user => user.id === item.id);
            return (
              <View style={styles.header}>
                <Image source={{uri: item.uri}} style={styles.avatar} />
                <View style={styles.max}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.textName}>
                    {item.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.textName,
                      {fontWeight: '400', color: colors.textSecondary},
                    ]}>
                    {item.handle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => onHandleSelect(item)}>
                  {isSelect ? (
                    <CheckCircle2
                      size={22}
                      color={colors.primary}
                      style={styles.tick}
                    />
                  ) : (
                    <View style={styles.circle} />
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
          extraData={[searchText, selected]}
        />
      </View>

      {selected.length > 0 && (
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={async () => {
            if (!roomId) return;

            const user_ids = selected.map(user => user.id);

            try {
              await dispatch(addPeopleToGroupChat({roomId, user_ids})).unwrap();
              GlobalAlertManager.show(
                'Thành công',
                'Đã thêm thành viên vào nhóm',
              );
              navigation.goBack();
            } catch (error: any) {
              GlobalAlertManager.show(
                'Lỗi',
                error?.message || 'Không thể thêm người dùng',
              );
            }
          }}>
          <Text style={[styles.title, {color: colors.background}]}>Thêm</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
