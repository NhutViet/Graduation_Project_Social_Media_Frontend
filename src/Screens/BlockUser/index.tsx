import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Users as listFollow} from './Data';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import ItemList from './Components/itemList';
import {BlockUsersStyles} from '../../StyleSheet/BlockUsersStyles';
import {Modalize} from 'react-native-modalize';
import ModalIsBlock from './Components/ModalIsBlock';
import {useNavigation} from '@react-navigation/native';

interface User {
  id: string;
  name: string;
  handle: string;
  uri: string;
}

export const BlockUser = () => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const styles = BlockUsersStyles(theme);
  const navigation = useNavigation();
  const [listUser, setListUser] = useState(listFollow);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const modalRef = useRef<Modalize>(null);
  const [userBlock, setUserBlock] = useState<User | null>(null);

  //hiện modal
  const onOpen = () => {
    modalRef.current?.open();
  };

  //xử lý tìm kiếm khi nhâpj vào
  useEffect(() => {
    if (searchText.trim().length > 0) {
      const filterUser = listFollow.filter((user: any) => {
        return (
          user.name
            .toLowerCase()
            .includes(searchText.trim().toLocaleLowerCase()) ||
          user.handle
            .toLowerCase()
            .includes(searchText.trim().toLocaleLowerCase())
        );
      });
      setListUser(filterUser);
    } else {
      setListUser(listFollow);
    }
  }, [searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Blocked an account</Text>
        <View style={{width: 14}}></View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          ref={inputRef}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          style={styles.inputBox}
        />
        <Image
          source={require('../../../assets/icon/search.png')}
          style={styles.iconSearch}
        />
        {isFocused && searchText !== '' && (
          <TouchableOpacity
            onPress={() => {
              inputRef.current?.blur();
              setIsFocused(false);
              setSearchText('');
            }}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.container, {paddingHorizontal: 20}]}>
        {listUser.length > 0 ? (
          <FlashList
            data={listUser}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            renderItem={({item}: any) => {
              return (
                <ItemList
                  uri={item.uri}
                  handle={item.handle}
                  name={item.name}
                  onhandleItem={() => {}}
                  onhandleBlock={() => {
                    setUserBlock(item);
                    onOpen();
                  }}
                />
              );
            }}
          />
        ) : (
          <Text style={[styles.notFound, {color: colors.text}]}>Not Found 🙂‍↔️!</Text>
        )}
      </View>
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        modalStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: 'hidden',
        }}>
        {userBlock && (
          <ModalIsBlock
            uri={userBlock.uri}
            handle={userBlock.handle}
            onHandleBlock={() => {
              const newList = listFollow.filter(
                user => user.id.toString() !== userBlock.id,
              );
              setListUser(newList);
              setSearchText('');
              modalRef.current?.close();
            }}
          />
        )}
      </Modalize>
    </SafeAreaView>
  );
};
