import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Peoples as list} from './Data';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {AddPeopleToGroupChatStyles} from '../../StyleSheet/AddPeopleToGroupChatStyles';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {GlobalAlertManager} from '../../../components/Global/AlertModal';

export const AddPeopleToGroupChat = () => {
  const [users, setUsers] = useState<any>(list);
  const [selected, setSelected] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const {theme} = useTheme();
  const colors = Colors[theme];
  const styles = AddPeopleToGroupChatStyles(theme);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    GlobalAlertManager.show('Thông báo', 'Đã sao chép văn bản');
  };

  useEffect(() => {
    if (searchText == '') {
      setUsers(list);
    } else {
      const search = list.filter(
        prev =>
          prev.name
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          prev.handle
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()),
      );
      setUsers(search);
    }
  }, [searchText]);

  const onHandleSelect = useCallback(
    (item: any) => {
      const isSelected = selected.some((prev: any) => prev.id === item.id);
      if (isSelected) {
        const filter = selected.filter((prev: any) => prev.id !== item.id);
        setSelected(filter);
      } else {
        setSelected(prev => [...prev, item]);
      }
    },
    [selected],
  );

  const onDeleteSelect = (item: any) => {
    const index = selected.findIndex((i: any) => i.id === item.id);
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
          <Image source={require('../../../assets/icon/left.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Thêm người</Text>
        <View style={styles.iconBack} />
      </View>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/icon/link.png')}
          style={styles.icon}
        />
        <View style={styles.max}>
          <Text style={styles.invite}>Liên kết mời</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.textName,
              {fontWeight: '400', color: colors.textSecondary},
            ]}>
            htts: //ig.me/ksjhdkjskbjhsbjkbvsjbvksjhdkjskbjhsbjkbvsjbv
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnCopy}
          onPress={() =>
            copyToClipboard(
              'htts: //ig.me/ksjhdkjskbjhsbjkbvsjbvksjhdkjskbjhsbjkbvsjbv',
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
        <Image
          source={require('../../../assets/icon/search.png')}
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
            <Image
              source={require('../../../assets/icon/closer.png')}
              style={styles.iconCloser}
            />
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
            renderItem={({item}: any) => {
              return (
                <View style={{marginRight: 15}}>
                  <Image
                    source={{uri: item.uri}}
                    style={[styles.avatar, {width: 60, height: 60}]}
                  />
                  <TouchableOpacity
                    onPress={() => onDeleteSelect(item)}
                    style={styles.btnDelete}>
                    <Image
                      source={require('../../../assets/icon/closer.png')}
                      style={styles.iconDelete}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
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
          renderItem={({item}: any) => {
            const isSelect = selected.some((user: any) => user.id === item.id);
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
                    <Image
                      source={require('../../../assets/icon/checked.png')}
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
        <TouchableOpacity style={styles.btnAdd}>
          <Text style={[styles.title, {color: colors.background}]}>Thêm</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
