import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {FlashList} from '@shopify/flash-list';

const ModalPeopleSeen = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [dataUser, setDataUser] = useState([
    {
      id: 1,
      name: 'user1',
      image:
        'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
      status: 1,
    },
    {
      id: 2,
      name: 'user2',
      image:
        'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
      status: 1,
    },
    {
      id: 3,
      name: 'user3',
      image:
        'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
      status: 0,
    },
    {
      id: 4,
      name: 'user4',
      image:
        'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
      status: 0,
    },
  ]);

  const RenderItem = ({
    item,
  }: {
    item: {id: number; name: string; image: string};
  }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.itemIcon} source={{uri: item.image}} />
      <Text style={styles.itemName}>{item.name}</Text>
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
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/users.png')}
                />
                <Text style={styles.quantity}>100</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Image
                  style={styles.icon}
                  source={require('../../../../assets/icon/x.png')}
                />
              </TouchableOpacity>
            </View>
            <FlashList
              showsVerticalScrollIndicator={false}
              data={dataUser}
              renderItem={({item}) => <RenderItem item={item} />}
              keyExtractor={item => item.id.toString()}
              estimatedItemSize={60} // Điều chỉnh dựa trên chiều cao thực tế của item
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
