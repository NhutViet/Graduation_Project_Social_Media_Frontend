import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { Heart, MessageCircle, Tag, Smile, Trash2, Archive, Sticker, Share2, Video, Bookmark, ThumbsDown, ThumbsUp, Clock, User, Search, Link, Download, ArrowRightLeft } from 'lucide-react-native';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../../components/Header'

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
          <Image source={require('../../../../assets/icon/right.png')}/>
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
      title: 'Interactions',
      items: [
        { label: 'Likes', icon: <Heart size={20} color={color.text} />, onPress: () => console.log('Navigate to Likes') },
        { label: 'Comments', icon: <MessageCircle size={20} color={color.text} />, onPress: () => console.log('Navigate to Comments') },
        { label: 'Tags', icon: <Tag size={20} color={color.text} />, onPress: () => console.log('Navigate to Tags') },
        { label: 'Sticker responses', icon: <Smile size={20} color={color.text} />, onPress: () => console.log('Navigate to Sticker responses') },
        { label: 'Reviews', icon: <Smile size={20} color={color.text} />, onPress: () => console.log('Navigate to Reviews') },
      ],
    },
    {
      title: 'Content you shared',
      items: [
        { label: 'Posts', icon: <Share2 size={20} color={color.text} />, onPress: () => console.log('Navigate to Posts') },
        { label: 'Reels', icon: <Video size={20} color={color.text} />, onPress: () => console.log('Navigate to Reels') },
        { label: 'Highlights', icon: <Bookmark size={20} color={color.text} />, onPress: () => console.log('Navigate to Highlights') },
      ],
    },
    {
      title: 'Suggested content',
      items: [
        { label: 'Not interested', icon: <ThumbsDown size={20} color={color.text} />, onPress: () => console.log('Navigate to Not interested') },
        { label: 'Interested', icon: <ThumbsUp size={20} color={color.text} />, onPress: () => console.log('Navigate to Interested') },
      ],
    },
    {
      title: 'How you use Cirla',
      items: [
        { label: 'Time spent', icon: <Clock size={20} color={color.text} />, onPress: () => console.log('Navigate to Time spent') },
        { label: 'Account history', icon: <User size={20} color={color.text} />, onPress: () => console.log('Navigate to Account history') },
        { label: 'Recent searches', icon: <Search size={20} color={color.text} />, onPress: () => console.log('Navigate to Recent searches') },
        { label: 'Link History', icon: <Link size={20} color={color.text} />, onPress: () => console.log('Navigate to Link History') },
      ],
    },
    {
      title: 'Information you shared with Cirla',
      items: [
        { label: 'Transfer your information', icon: <ArrowRightLeft size={20} color={color.text} />, onPress: () => console.log('Navigate to Transfer your information') },
        { label: 'Download your information', icon: <Download size={20} color={color.text} />, onPress: () => console.log('Navigate to Download your information') },
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
              <Image
                source={require('../../../../assets/icon/left.png')}
                style={[styles.backIcon, {tintColor: color.text}]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenterSection}>
            <Text style={[styles.headerTitle, {color: color.text}]}>Your activity</Text>
          </View>

          <View style={styles.headerRightSection}></View>
        </View>

        <ScrollView 
            style={[styles.container, {backgroundColor: color.background}]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.introContainer}>
                <Text style={[styles.introTitle, {color: color.text}]}>One place to manage your activity</Text>
                <View style={styles.introSubtitleContainer}>
                    <Text style={[styles.introSubtitle, {color: color.textSecondary}]}>View and manage your interactions, content and account activity. 
                        <TouchableOpacity style={styles.introLearnMoreButton} onPress={() => console.log('Learn more pressed')}>
                            <Text style={styles.introLearnMoreText}>Learn more</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </View>
            {sections.map((section, index) => (
                <View key={index}>
                    <View style={[styles.divider, {borderColor: color.border}]}/>
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
    introLearnMoreButton: {
        alignItems: 'center'
    },
    introLearnMoreText: {
        color: '#007bff', 
        fontSize: 16
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