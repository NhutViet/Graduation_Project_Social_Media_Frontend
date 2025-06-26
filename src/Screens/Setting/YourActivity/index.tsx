import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native'
import React from 'react'
import { Heart, MessageCircle, Tag, Smile, Share2, Video, Bookmark, ThumbsDown, ThumbsUp, Clock, User, Search, Link, Download, ArrowRightLeft } from 'lucide-react-native';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface Item {
  label: string;
  icon: JSX.Element;
  onPress: () => void;
}

interface SectionProps {
  title: string;
  items: Item[];
}

const Section: React.FC<SectionProps> = ({ title, items }) => {
    const navigation: any = useNavigation();
    const {theme} = useTheme();
    const color = Colors[theme];
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, {color: color.text}]}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.itemContainer, {backgroundColor: color.background}]}
          activeOpacity={0.7}
          onPress={item.onPress}
        >
          <View style={styles.itemContent}>
            {item.icon}
            <Text style={[styles.itemLabel, {color: color.text}]}>{item.label}</Text>
          </View>
          <ChevronRight color={color.textSecondary}/>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const YourActivity = () => {
    const {theme} = useTheme();
    const color = Colors[theme];
    const navigation: any = useNavigation();
    const sections: { title: string; items: Item[] }[] = [
    {
      title: 'Lượt tương tác',
      items: [
        { label: 'Lượt thích', icon: <Heart size={20} color={color.text} />, onPress: () => console.log('Navigate to Likes') },
        { label: 'Bình luận', icon: <MessageCircle size={20} color={color.text} />, onPress: () => console.log('Navigate to Comments') },
        { label: 'Thẻ', icon: <Tag size={20} color={color.text} />, onPress: () => console.log('Navigate to Tags') },
        { label: 'Phản hồi bằng nhãn dán', icon: <Smile size={20} color={color.text} />, onPress: () => console.log('Navigate to Sticker responses') },
        { label: 'Bài đánh giá', icon: <Smile size={20} color={color.text} />, onPress: () => console.log('Navigate to Reviews') },
      ],
    },
    {
      title: 'Nội dung bạn chia sẻ',
      items: [
        { label: 'Bài viết', icon: <Share2 size={20} color={color.text} />, onPress: () => console.log('Navigate to Posts') },
        { label: 'Reels', icon: <Video size={20} color={color.text} />, onPress: () => console.log('Navigate to Reels') },
        { label: 'Tin nổi bật', icon: <Bookmark size={20} color={color.text} />, onPress: () => console.log('Navigate to Highlights') },
      ],
    },
    {
      title: 'Nội dung gợi ý',
      items: [
        { label: 'Không quan tâm', icon: <ThumbsDown size={20} color={color.text} />, onPress: () => console.log('Navigate to Not interested') },
        { label: 'Quan tâm', icon: <ThumbsUp size={20} color={color.text} />, onPress: () => console.log('Navigate to Interested') },
      ],
    },
    {
      title: 'Cách bạn dùng Cirla',
      items: [
        { label: 'Thời gian sử dụng', icon: <Clock size={20} color={color.text} />, onPress: () => console.log('Navigate to Time spent') },
        { label: 'Lịch sử tài khoản', icon: <User size={20} color={color.text} />, onPress: () => console.log('Navigate to Account history') },
        { label: 'Tìm kiếm gần đây', icon: <Search size={20} color={color.text} />, onPress: () => console.log('Navigate to Recent searches') },
        { label: 'Lịch sử liên kết', icon: <Link size={20} color={color.text} />, onPress: () => console.log('Navigate to Link History') },
      ],
    },
    {
      title: 'Thông tin bạn đã chia sẻ với Cirla',
      items: [
        { label: 'Chuyển thông tin của bạn', icon: <ArrowRightLeft size={20} color={color.text} />, onPress: () => console.log('Navigate to Transfer your information') },
        { label: 'Tải thông tin của bạn xuống', icon: <Download size={20} color={color.text} />, onPress: () => console.log('Navigate to Download your information') },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.safeContainer, {backgroundColor: color.background}]}>
        <View style={[styles.headerContainer, {backgroundColor: color.background}]}>
          <View style={styles.headerLeftSection}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ChevronLeft color={color.text}/>
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenterSection}>
            <Text style={[styles.headerTitle, {color: color.text}]}>Hoạt động của bạn</Text>
          </View>

          <View style={styles.headerRightSection}></View>
        </View>

        <ScrollView 
            style={[styles.container, {backgroundColor: color.background}]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.introContainer}>
                <Text style={[styles.introTitle, {color: color.text}]}>Một nơi để quản lý hoạt động của bạn</Text>
                <View style={styles.introSubtitleContainer}>
                    <Text style={[styles.introSubtitle, {color: color.textSecondary}]}>
                      Xem và quản lý lượt tương tác, nội dung cũng như hoạt động của tài khoản. <Text onPress={() => {Alert.alert('navigate')}} style={{fontSize: 16, color: "#007AFF",}}>Tìm hiểu thêm</Text>
                    </Text>
                </View>
            </View>
            {sections.map((section, index) => (
                <View key={index}>
                    {index !== 0 && <View style={[styles.divider, {borderColor: color.border}]}/>}
                    <Section
                        title={section.title}
                        items={section.items}
                    />
                </View>
            ))}
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 60,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },
    headerLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerCenterSection: {
        alignItems: 'center',
        flex: 2,
    },
    headerRightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    introContainer: {
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        width: "80%"
    },
    introSubtitleContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    introSubtitle: {
        fontSize: 16,
        marginVertical: 16,
        textAlign: 'center',
    },
    divider: {
        width: '100%', 
        borderWidth: 1, 
        marginVertical: 10
    },
    sectionContainer: {
        marginBottom: 7,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemLabel: {
        marginLeft: 12,
        fontSize: 16,
    },
    itemArrow: {
        fontSize: 16,
        color: '#aaa',
    },
})