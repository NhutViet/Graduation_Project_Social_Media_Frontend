import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import React from 'react';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';

const categoriesData = [
  {
    id: '1',
    title: 'Least Interaction',
    description: 'abc',
    multiImage:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '2',
    title: 'Most Shown on Feed',
    description: 'abc',
    multiImage:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '3',
    title: 'Creators and Entrepreneurs',
    description: 'abc',
    multiImage:
      'https://i.pinimg.com/736x/8c/71/92/8c7192c084765c076ef33024c0b34406.jpg',
  },
];

const suggestedData = [
  {
    id: '1',
    username: 'abc',
    handle: 'User1',
    profile_pic:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '2',
    username: 'xyz',
    handle: 'User2',
    profile_pic:
      'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
  },
  {
    id: '3',
    username: 'cde',
    handle: 'User3',
    profile_pic:
      'https://i.pinimg.com/736x/8c/71/92/8c7192c084765c076ef33024c0b34406.jpg',
  },
];

const FollowingTab = () => {
  const {theme} = useTheme();
  const color = Colors[theme];

  const renderCategoryItem = ({item}: {item: any}) => (
    <TouchableOpacity>
      <View style={styles.categoryItem}>
        <Image source={{uri: item.multiImage}} style={styles.categoryImage} />
        <View
          style={[styles.categoryInfo, {backgroundColor: color.background}]}>
          <Text style={[styles.categoryTitle, {color: color.text}]}>
            {item.title}
          </Text>
          <Text
            style={[styles.categoryDescription, {color: color.textSecondary}]}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSortItem = ({item}: {item: any}) => (
    <View style={[styles.suggestedItem, {backgroundColor: color.background}]}>
      <TouchableOpacity style={styles.touchableInfo}>
        <Image source={{uri: item.profile_pic}} style={styles.profilePic} />
        <View style={styles.suggestedInfo}>
          <Text style={[styles.handle, {color: color.text}]}>
            {item.handle}
          </Text>
          <Text style={[styles.username, {color: color.textSecondary}]}>
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.messageButton, {borderColor: color.text}]}>
        <Text style={[styles.messageText, {color: color.text}]}>Message</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          source={require('../../../assets/icon/menu-dots-vertical.png')}
          style={[styles.moreIcon, {tintColor: color.text}]}
        />
      </TouchableOpacity>
    </View>
  );

  const renderSuggestedItem = ({item}: {item: any}) => (
    <View style={[styles.suggestedItem, {backgroundColor: color.background}]}>
      <TouchableOpacity style={styles.touchableInfo}>
        <Image source={{uri: item.profile_pic}} style={styles.profilePic} />
        <View style={styles.suggestedInfo}>
          <Text style={[styles.handle, {color: color.text}]}>
            {item.handle}
          </Text>
          <Text style={[styles.username, {color: color.textSecondary}]}>
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          source={require('../../../assets/icon/menu-dots-vertical.png')}
          style={[styles.moreIcon, {tintColor: color.text}]}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, {backgroundColor: color.background}]}>
      <FlashList
        data={categoriesData}
        keyExtractor={item => item.id}
        renderItem={renderCategoryItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        ListHeaderComponent={
          <Text style={[styles.sectionHeader, {color: color.text}]}>
            Categories
          </Text>
        }
      />
      <FlashList
        data={suggestedData}
        keyExtractor={item => item.id}
        renderItem={renderSortItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        ListHeaderComponent={
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={{color: color.text, fontSize: 18, fontWeight: 'bold'}}>
              Sort by Default
            </Text>
            <Image
              source={require('../../../assets/icon/icon_sort.png')}
              style={[styles.sortIcon, {tintColor: color.text}]}
            />
          </TouchableOpacity>
        }
      />
      <FlashList
        data={suggestedData}
        keyExtractor={item => item.id}
        renderItem={renderSuggestedItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        ListHeaderComponent={
          <Text style={[styles.sectionHeader, {color: color.text}]}>
            Suggested for You
          </Text>
        }
      />
    </ScrollView>
  );
};

export default FollowingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDescription: {
    color: '#666',
  },
  sortSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortIcon: {
    width: 16,
    height: 16,
  },
  suggestedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  touchableInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  suggestedInfo: {
    flex: 1,
  },
  handle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    color: '#666',
  },
  followButton: {
    width: 89,
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    width: 89,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followText: {
    color: '#fff',
  },
  messageText: {
    color: '#000',
  },
  moreIcon: {
    width: 16,
    height: 16,
  },
});
