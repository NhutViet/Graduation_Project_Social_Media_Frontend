import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../services/store';
import { fetchFollowing, relationAction } from '../../../services/relationRedux/relationSlice';
import ItemList from './Components/itemList';
import { BlockUsersStyles } from '../../StyleSheet/BlockUsersStyles';
import { useTheme } from '../../util/ThemeContext';
import { Modalize } from 'react-native-modalize';
import ModalIsBlock from './Components/ModalIsBlock';
import {Colors} from '../../../assets/color/Colors'

export const BlockUser = () => {
    const {theme} = useTheme();
  const colors = Colors[theme];
  const styles = BlockUsersStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.user?._id);

  const { following, loading, error } = useSelector((state: RootState) => state.relation);
  const [listUser, setListUser] = useState(following);
  const [searchText, setSearchText] = useState('');
  const [userBlock, setUserBlock] = useState<any | null>(null);
  const modalRef = React.useRef<Modalize>(null);

  // fetch on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId) dispatch(fetchFollowing({ userId }));
    });
    return unsubscribe;
  }, [navigation, userId]);

  // sync local list when following changes
  useEffect(() => {
    setListUser(following);
  }, [following]);

  useEffect(() => {
    if (error) Alert.alert('Error', error);
  }, [error]);

  // search filter
  useEffect(() => {
    if (searchText.trim().length > 0) {
      const filtered = following.filter(u =>
        u.handleName.toLowerCase().includes(searchText.toLowerCase()) ||
        u.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setListUser(filtered);
    } else {
      setListUser(following);
    }
  }, [searchText, following]);

  const onOpen = () => modalRef.current?.open();

  const handleBlock = async () => {
    if (!userBlock) return;
    try {
      await dispatch(
        relationAction({ targetId: userBlock._id, action: 'block' })
      ).unwrap();
      modalRef.current?.close();
      if (userId) dispatch(fetchFollowing({ userId }));
    } catch (e: any) {
      Alert.alert('Error', e || 'Block failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/icon/left.png')} style={styles.iconBack} />
        </TouchableOpacity>
        <Text style={styles.title}>Chặn tài khoản</Text>
        <View style={{ width: 14 }} />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm kiếm"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.textSecondary}
          style={styles.inputBox}
        />
        <Image source={require('../../../assets/icon/search.png')} style={styles.iconSearch} />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Text style={styles.cancel}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.container, { paddingHorizontal: 20 }]}>  
        { !loading && listUser.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có người dùng được đề xuất để chặn.</Text>
          </View>
        ) : (
          <FlashList
            data={listUser}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ItemList
                uri={item.profilePic}
                handle={item.handleName}
                name={item.username}
                onhandleItem={() => {}}
                onhandleBlock={() => { setUserBlock(item); onOpen(); }}
              />
            )}
          />
        )}
      </View>
      <Modalize ref={modalRef} adjustToContentHeight modalStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
        {userBlock && (
          <ModalIsBlock
            uri={userBlock.profilePic}
            handle={userBlock.handleName}
            onHandleBlock={handleBlock}
          />
        )}
      </Modalize>
    </SafeAreaView>
  );
};