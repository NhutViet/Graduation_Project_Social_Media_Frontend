import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions} from 'react-native'
import React, {forwardRef, useRef} from 'react'
import {Modalize} from 'react-native-modalize';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';

interface ModalReactionProps{
    data: UserItem[];
}

type UserItem = {
    id: string;
    username: string;
    profile_pic: string;
    bio: string;
    is_following: boolean;
};

const ModalReaction = forwardRef<Modalize, ModalReactionProps>(({ data }, ref) => {
    const {theme} = useTheme();
    const color = Colors[theme];

    const renderItem = ({item}: {item: UserItem}) => (
    <View style={[styles.userItem, {backgroundColor: color.modal}]}>
      <Image source={{uri: item.profile_pic}} style={styles.avatar} />
      <View style={[styles.userInfo, {backgroundColor: color.modal}]}>
        <Text style={[styles.username, {color: color.text}]}>
          {item.username}
        </Text>
        <Text style={[styles.bio, {color: color.text}]}>{item.bio}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          item.is_following
            ? [styles.disabledButton, {borderColor: color.text}]
            : styles.activeButton,
        ]}
        disabled={item.is_following}>
        <Text
          style={[
            item.is_following
              ? [styles.followButtonText, {color: color.text}]
              : styles.followButtonText,
          ]}>
          {item.is_following ? 'Followed' : 'Follow'}
        </Text>
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
        <FlashList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            estimatedItemSize={50}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
        />
    </Modalize>
  )
});

export default ModalReaction

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
})