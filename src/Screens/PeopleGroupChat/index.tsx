import {
  Image,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import ItemList from './Components/ItemList';
import {Peoples as list} from './Data';
import {FlashList} from '@shopify/flash-list';
import {PeopleGroupChatStyles} from '../../StyleSheet/PeopleGroupChatStyles';
import {useNavigation} from '@react-navigation/native';

export const PeopleGroupChat = () => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const [isReqired, setIsReqired] = useState(false);
  const [user, setUser] = useState<
    {
      id: number;
      name: string;
      handle: string;
      uri: string;
    }[]
  >(list);
  const [admin, setAdmin] = useState<{
    id: number;
    name: string;
    handle: string;
    uri: string;
  } | null>(null);
  const mine = 1;
  const styles = PeopleGroupChatStyles(theme);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const ad = list.find(prev => prev.id == 2) ?? null;
    const following = list.filter(prev => prev.id !== 2);
    setAdmin(ad);
    setUser(following);
  }, [list]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Mọi người</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPeopleToGroupChat')}>
          <Image
            source={require('../../../assets/icon/invite.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.rowSpace}>
          <Text style={[styles.title, {fontWeight: '400'}]}>
            Cần phải được phê duyệt để tham gia
          </Text>
          <Switch
            value={isReqired}
            onValueChange={setIsReqired}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.white}
          />
        </View>
        <Text style={styles.titleS}>Quản lý</Text>
        {admin && (
          <View style={{marginHorizontal: 24}}>
            <ItemList
              uri={admin.uri}
              name={admin.name}
              handle={admin.handle}
              isMine={admin.id === mine}
              isAdmin={true}
            />
          </View>
        )}
        <Text style={styles.titleS}>Đang theo dõi</Text>
        <View style={[styles.container, {marginHorizontal: 24}]}>
          <FlashList
            data={user}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            renderItem={({
              item,
            }: {
              item: {
                id: number;
                name: string;
                handle: string;
                uri: string;
              };
            }) => {
              return (
                <ItemList
                  uri={item.uri}
                  name={item.name}
                  handle={item.handle}
                  isMine={item.id === mine}
                />
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
