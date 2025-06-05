import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import MessageBoxStyles from '../../StyleSheet/MessageBoxStyles';
import MessageItem from '../../../components/MessageItem';
import User from '../../(tabs)/Home/components/Story';
import React, {useState, useEffect, useRef} from 'react';
import {
  messageData,
  storyUsers,
  StoryUser,
  searchMessages,
  User as UserType,
  Message,
} from '../../MockData/message.mock';

export const MessageBox = (props: any) => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const styles = MessageBoxStyles(theme);
  const {onBack} = props;

  // State management
  const [dataUser, setDataUser] = useState<StoryUser[]>(storyUsers);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<TextInput>(null);

  // Mock data
  const data = messageData;

  const handleUserPress = (user: StoryUser) => {
    console.log('Navigating to SeenStory with user:', user);
    setDataUser(prevData =>
      prevData.map(item => (item.id === user.id ? {...item, status: 0} : item)),
    );
    navigation.navigate('SeenStoryOwner', {selectedItem: user});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBlock}>
          <TouchableOpacity style={styles.iconBlock} onPress={onBack}>
            <Image
              source={require('../../../assets/icon/left.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.name}>mimi11_o</Text>
        </View>
        <View style={styles.headerBlock}>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/star_mess.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/new_mess.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBlock}>
          <View style={styles.iconBlock}>
            <Image
              style={styles.icon}
              source={require('../../../assets/icon/search.png')}
            />
          </View>
          <TextInput
            ref={searchInputRef}
            placeholder="Tìm kiếm tin nhắn"
            placeholderTextColor={color.text}
            style={[
              styles.searchInput,
              {paddingRight: searchQuery.length > 0 ? 40 : 0},
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton}>
              <Image
                style={styles.clearIcon}
                source={require('../../../assets/icon/close_small.png')}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Stories Section */}
      <View style={styles.storiesContainer}>
        <FlashList
          data={dataUser}
          renderItem={({item}: any) => {
            return (
              <User
                name={item.name}
                image={item.image}
                status={item.status}
                func={() => handleUserPress(item)}
              />
            );
          }}
          horizontal
          estimatedItemSize={100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContentContainer}
        />
      </View>

      {/* Messages Header */}
      <View style={styles.messagesHeader}>
        <Text style={styles.messagesHeaderTitle}>Tin nhắn</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('PendingMessages')}>
          <Text style={styles.messagesHeaderSubtitle}>Tin nhắn chờ xử lý</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <View style={styles.messagesListContainer}>
        <FlashList
          data={data}
          renderItem={({item}) => {
            return (
              <MessageItem
                img={item.img}
                name={item.name}
                description={item.description}
                isGroup={item.isGroup || false}
              />
            );
          }}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
