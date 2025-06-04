import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';
import {Likers} from '../../../../services/likersRedux/likersSlice';
import {resetStatus} from '../../../../services/likersRedux/likersReducer';

interface ModalReactionProps {
  postId: string;
  isLiked: boolean;
}

type UserItem = {
  id: string;
  username: string;
  profile_pic: string;
  bio: string;
  is_following: boolean;
};

const ModalReaction = forwardRef<Modalize, ModalReactionProps>(
  ({postId, isLiked}, ref) => {
    const {theme} = useTheme();
    const color = Colors[theme];

    //redux
    const dispatch = useDispatch<AppDispatch>();
    const {listLikers, isSuccess} = useSelector(
      (state: RootState) => state.likers,
    );
    const {refreshToken} = useSelector((state: RootState) => state.user);
    const [users, setUsers] = useState<any[]>([]);
    const {user} = useSelector((state: RootState) => state.user);

    useEffect(() => {
      if (postId) {
        const fetchLikers = async () => {
          try {
            const resultAction = await dispatch(
              Likers({postId, refreshToken}),
            ).unwrap();
            setUsers(resultAction.data);
          } catch (error) {
            console.error('Lấy danh sách thất bại:', error);
          }
        };
        fetchLikers();
      }
    }, [postId, isLiked]);

    const renderItem = ({item}: {item: any}) => (
      <View style={[styles.userItem, {backgroundColor: color.modal}]}>
        <Image source={{uri: item.profilePic}} style={styles.avatar} />
        <View style={[styles.userInfo, {backgroundColor: color.modal}]}>
          <Text style={[styles.username, {color: color.text}]}>
            {item.username}
          </Text>
          <Text style={[styles.bio, {color: color.text}]}>
            {item.handleName}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.followButton,
            false
              ? [styles.disabledButton, {borderColor: color.text}]
              : styles.activeButton,
          ]}
          disabled={false}>
          {item.userId !== user?._id && (
            <Text
              style={[
                false
                  ? [styles.followButtonText, {color: color.text}]
                  : styles.followButtonText,
              ]}>
              {false ? 'Followed' : 'Follow'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );

    return (
      <Modalize
        ref={ref}
        adjustToContentHeight={false}
        modalHeight={Dimensions.get('window').height * 0.7}
        modalStyle={[styles.modal, {backgroundColor: color.modal}]}
        handleStyle={styles.modalHandle}
        handlePosition="inside"
        panGestureEnabled={true}
        onOverlayPress={() => ref && (ref as any).current?.close()}
        HeaderComponent={
          <View style={styles.modalHeader}>
            <Text style={[styles.title, {color: color.text}]}>Favorites</Text>
          </View>
        }
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          nestedScrollEnabled: true,
        }}>
        <View style={{flex: 1, minHeight: 200}}>
          {listLikers.length > 0 ? (
            <FlashList
              data={users}
              keyExtractor={item => item.userId}
              renderItem={renderItem}
              estimatedItemSize={500}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            />
          ) : (
            <Text style={{
              textAlign: 'center',
              fontSize: 18,
              margin: 30,
              color: color.textSecondary,
              fontWeight: '400',
            }}>Hãy trở thành người đầu tiên yêu thích bài viết nhé!</Text>
          )}
        </View>
      </Modalize>
    );
  },
);

export default ModalReaction;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  modalHandle: {
    backgroundColor: '#ccc',
    height: 4,
    width: 50,
    alignSelf: 'center',
    borderRadius: 2,
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bio: {
    color: '#888',
    fontSize: 14,
  },
  followButton: {
    width: 89,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  disabledButton: {
    borderWidth: 1,
    borderRadius: 10,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
