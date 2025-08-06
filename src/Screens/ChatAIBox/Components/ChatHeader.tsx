import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ArrowLeft, Sparkles} from 'lucide-react-native';
import {useTheme} from '../../../../src/util/ThemeContext';
import {Colors} from '@assets/color/Colors';
import {useNavigation} from '@react-navigation/native';

const ChatHeader = () => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft size={22} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.leftSection}>
        <View
          style={[
            styles.avatarContainer,
            {backgroundColor: colors.transparent, borderColor: colors.primary},
          ]}>
          <Sparkles size={24} color={colors.primary} strokeWidth={2.5} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: colors.primary}]}>
            Trợ lý Hermes
          </Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
            Luôn sẵn sàng hỗ trợ
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1125,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  avatarContainer: {
    width: 35,
    height: 35,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
