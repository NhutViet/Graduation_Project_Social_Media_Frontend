import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ItemNewMessage from './component/itemNewMessage';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useState} from 'react';
import {FlashList} from '@shopify/flash-list';

const NewMessage = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  const [search, setSearch] = useState('');

  const chatList = [
    {
      nameChat: 'Travel Buddies',
      userHandle1: '@alice',
      img1: 'https://i.pinimg.com/736x/28/77/e9/2877e91981a7d5c2eb6f7c2fb6547aba.jpg',
    },
    {
      nameChat: 'Code Masters',
      userHandle1: '@charlie',
      userHandle2: '@dave',
      img1: 'https://i.pinimg.com/736x/bd/6e/c8/bd6ec84051cd8ded5ba5908b36691efc.jpg',
      img2: 'https://i.pinimg.com/736x/85/71/d3/8571d3d3df98d0e6f25a0adaf23aff26.jpg',
    },
    {
      nameChat: 'Gaming Night',
      userHandle1: '@eve',
      userHandle2: '@frank',
      img1: 'https://i.pinimg.com/736x/0e/10/af/0e10afbd27a8c35c61703d384e632668.jpg',
      img2: 'https://i.pinimg.com/736x/20/a2/8f/20a28feb2a14181daafe7a37c92fc9bf.jpg',
    },
    {
      nameChat: 'Startup Talks',
      userHandle1: '@grace',
      img1: 'https://i.pinimg.com/736x/2e/93/d4/2e93d47d549ce389fcedf62fba9ea02e.jpg',
    },
    {
      nameChat: 'Design Team',
      userHandle1: '@isabel',
      userHandle2: '@jack',
      img1: 'https://i.pinimg.com/736x/ae/37/92/ae3792573c22c0236005114e65f61c52.jpg',
      img2: 'https://i.pinimg.com/736x/86/20/43/8620430901473bce3f4a6b287ddca6c1.jpg',
    },
    {
      nameChat: 'Music Collab',
      userHandle1: '@kate',
      img1: 'https://i.pinimg.com/736x/72/02/1a/72021a40a1b12523b3b058a4981b8551.jpg',
    },
    {
      nameChat: 'Fitness Goals',
      userHandle1: '@maria',
      img1: 'https://i.pinimg.com/736x/2b/3e/d5/2b3ed538188ef38ac58efc1fba62673c.jpg',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.blockIcon}
          onPress={() => navigation.goBack()}>
          <Image
            style={[styles.icon, {tintColor: color.text}]}
            source={require('../../../assets/icon/left.png')}
          />
        </TouchableOpacity>
        <Text style={[styles.title, {color: color.text}]}>New Message</Text>
        <View style={styles.block}></View>
      </View>
      <FlashList
        data={chatList}
        renderItem={({item}) => (
          <ItemNewMessage
            nameChat={item.nameChat}
            userHandle1={item.userHandle1}
            userHandle2={item.userHandle2}
            img1={item.img1}
            img2={item.img2}
          />
        )}
        estimatedItemSize={100}
        contentContainerStyle={{paddingBottom: 20}}
        ListHeaderComponent={
          <>
            <View style={styles.rowContainer}>
              <Text style={[styles.textNormal, {color: color.gray21}]}>
                To:
              </Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search"
                placeholderTextColor={color.gray21}
                style={[styles.input, {color: color.text}]}
              />
            </View>

            <ItemNewMessage
              nameChat="Group Chat"
              userHandle1="Message people privately"
              icon={require('../../../assets/icon/group_chat.png')}
            />
            <ItemNewMessage
              nameChat="AI Chat"
              icon={require('../../../assets/icon/ai.png')}
            />

            <Text
              style={[
                styles.title,
                {color: color.text, marginHorizontal: 16, marginBottom: 22},
              ]}>
              Suggested
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  blockIcon: {
    width: 18,
    height: 18,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  block: {
    width: 20,
    height: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  textNormal: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    width: '100%',
    height: 50,
  },
});

export default NewMessage;
