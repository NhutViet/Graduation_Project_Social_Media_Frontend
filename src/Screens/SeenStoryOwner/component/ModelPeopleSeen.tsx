import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {UsersRound, X} from 'lucide-react-native';

const ModalPeopleSeen = ({
  visible,
  onClose,
  users,
}: {
  visible: boolean;
  onClose: () => void;
  users: {_id: string; handleName: string; profilePic: string}[];
}) => {
  console.log('ModalPeopleSeen users:', JSON.stringify(users, null, 2));
  const RenderItem = ({
    item,
  }: {
    item: {_id: string; handleName: string; profilePic: string};
  }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.itemIcon} source={{uri: item.profilePic}} />
      <Text style={styles.itemName}>{item.handleName}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <Pressable style={styles.content}>
            <View style={styles.header}>
              <View style={{flexDirection: 'row'}}>
                <UsersRound color={'#fff'} />
                <Text style={styles.quantity}>{users.length}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <X color={'#fff'} />
              </TouchableOpacity>
            </View>
            <FlashList
              showsVerticalScrollIndicator={false}
              data={users}
              renderItem={({item}) => <RenderItem item={item} />}
              keyExtractor={item =>
                item?._id?.toString?.() || Math.random().toString()
              }
              estimatedItemSize={60}
            />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ModalPeopleSeen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#000',
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  quantity: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
