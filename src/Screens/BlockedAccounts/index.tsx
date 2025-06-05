import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import ItemUnlock from './Components/ItemUnlock';
import {BlockedAccountsStyles} from '../../StyleSheet/BlockedAccountsStyles';
import { useTheme } from '../../util/ThemeContext';

const DATA = [
    {
        id: 1,
        name: 'Phi',
        handle: 'mimi11_o',
        uri: 'https://th.bing.com/th/id/R.712dfd9a00dbfdfa8fd55e5f426acaed?rik=tquT6sUegYbhtA&riu=http%3a%2f%2fimages6.fanpop.com%2fimage%2fphotos%2f40900000%2fPuppy-dogs-40949099-1280-1115.jpg&ehk=OHQ5dncG%2b5%2bWSpZjjcRKF6oW9lHgy%2fF69yt4z4lESyg%3d&risl=&pid=ImgRaw&r=0',
    },
    {
        id: 2,
        name: 'Thiên Phúc',
        handle: 'bibiibi',
        uri: 'https://i.imgflip.com/xv3ox.jpg',
    },
    {
        id: 3,
        name: 'Quốc Anh',
        handle: 'sososo',
        uri: 'https://th.bing.com/th/id/OIP.0sCFO2pxPGCPIHXDsbo9UgAAAA?cb=iwc2&w=300&h=252&rs=1&pid=ImgDetMain',
    },
    {
        id: 4,
        name: 'Nhựt Việt',
        handle: 'whatwwhat',
        uri: 'https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/anh-meme-43.jpg',
    },
    {
        id: 5,
        name: 'Phú Quý',
        handle: 'kkkkkk',
        uri: 'https://i.kym-cdn.com/entries/icons/original/000/043/403/cover3.jpg',
    },
    {
        id: 6,
        name: 'Trịnh Phúc',
        handle: 'oooo0',
        uri: 'https://preview.redd.it/hahahahahahahaha-v0-ht00azzv2djc1.jpeg?auto=webp&s=fa0a547fbdd389b8f4eb25ea189cf11305c1c4fd',
    },
];

export const BlockedAccounts = () => {
  const navigation = useNavigation<any>();
  const {theme} = useTheme();
  const styles = BlockedAccountsStyles(theme);
  const [isModal, setIsModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Image source={require('../../../assets/icon/left.png')} style={styles.icon}/>
        </TouchableOpacity>
        <Text style={styles.title}>Tài khoản bị chặn</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BlockUser')}>
            <Image source={require('../../../assets/icon/add.png')} style={styles.icon}/>
        </TouchableOpacity>
      </View>
      <View style={[styles.container, {marginHorizontal: 24}]}>
        <FlashList
            data={DATA}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
                return (
                    <ItemUnlock uri={item.uri} handle={item.handle} onHandleUnBlock={() => {
                        setSelected(item);
                        setIsModal(true);
                    }}/>
                );
            }}
        />
      </View>
      <Modal visible={isModal} transparent={true} animationType='fade'>
  <View style={styles.modal}>
    <View style={styles.modalContainer}>
      {selected && (
        <>
          <Text style={[styles.notiTitle]}>Bỏ chặn {selected.handle}?</Text>
          <Text style={styles.notiText}>
            {selected.handle} và các tài khoản khác mà họ có hoặc có thể tạo sẽ có thể yêu cầu theo dõi và nhắn tin cho bạn trên Cirla. Họ sẽ không được thông báo rằng bạn đã bỏ chặn họ.
          </Text>
          <TouchableOpacity
            style={styles.btnModal}
            onPress={() => {
              setIsModal(false);
              setSelected(null);
            }}>
            <Text style={[styles.notiTitle, {color: 'red', marginTop: 0}]}>Bỏ chặn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCance}
            onPress={() => {
              setIsModal(false);
              setSelected(null);
            }}>
            <Text style={[styles.notiTitle, {fontWeight: '400', marginTop: 0}]}>Hủy</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};
