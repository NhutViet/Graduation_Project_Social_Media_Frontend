import { Image, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Pressable, ActivityIndicator  } from 'react-native'
import React, { useState } from 'react'
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';
import Video from 'react-native-video';

const data = [
  {
    id: '1',
    date: '2023-10-18',
    imageURL: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
    saved: true,
  },
  {
    id: '2',
    date: '2023-12-15',
    videoURL: 'https://www.w3schools.com/html/mov_bbb.mp4',
    saved: false,
  },
  {
    id: '3',
    date: '2024-03-26',
    videoURL: 'https://www.w3schools.com/html/movie.mp4',
    saved: true,
  },
  {
    id: '4',
    date: '2024-05-07',
    imageURL: 'https://i.pinimg.com/736x/5a/92/e7/5a92e7f5a37dbcf79c6740dea218ea52.jpg',
    saved: false,
  },
];

const formatMonthText = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day}\n${month}`;
  };

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

const StoriesTab = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [isData, setIsData] = useState(true);
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.itemContainer}>
        {item.videoURL ? (
          <Pressable>
            <Video
              source={{ uri: item.videoURL }}
              style={styles.media}
              resizeMode="contain"
              paused={true}
            />
          </Pressable>
        ) : (
          <Pressable onPress={() => navigation.navigate('BottomTabs')}>
            <Image source={{ uri: item.imageURL }} style={styles.media} />
          </Pressable>
        )}

        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatMonthText(item.date)}</Text>
        </View>

        {item.saved && (
          <TouchableOpacity style={styles.heartIcon}>
            <Image
              source={require('../../../../../assets/icon/highlight.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isData ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{height: '90%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 65, backgroundColor: color.background}}>
          <View style={{width: 100, height: 100, borderWidth: 1, borderRadius: 80, borderColor: color.text, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: 70, height: 70, resizeMode: 'contain', tintColor: color.text}} source={require('../../../../../assets/icon/archiveStory.png')}/>
          </View>
          <Text style={{fontSize: 19, fontWeight: 'bold', color: color.text, marginVertical: 10}}>Add to your story</Text>
          <Text style={{fontSize: 15, color: color.secondary, textAlign:"center"}}>Keep your stories in your archive after they disappear, so you can look back on your memories. Only you can see what's in your archive.</Text>
        </View>
      )}
      </SafeAreaView>
  )
}

export default StoriesTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE*2,
    margin: 1,
    position: 'relative',
    backgroundColor: '#000'
  },
  media: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 17,
    textAlign: 'center'
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
  },
  icon: {
    width: 16,
    height: 16,
  },
  note: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})