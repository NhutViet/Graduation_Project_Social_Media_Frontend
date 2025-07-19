import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '@assets/color/Colors';
import {ArrowLeft} from 'lucide-react-native';

export const MessageUndefined = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={22} color={color.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        <Text style={[styles.messageText, {color: color.text}]}>
          Không tìm thấy hộp thoại tin nhắn
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
