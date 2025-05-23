import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/ThemeContext';
import { useNotificationSettingsStyles } from '../../../StyleSheet/NotificationSetingsStyles';

export const Notifications = () => {
  const { theme } = useTheme();
  const navigation: any = useNavigation();
  const styles = useNotificationSettingsStyles();
  const [pauseAll, setPauseAll] = useState(false);

  // options that have detailed screens
  const detailedOptions = [
    'Following and followers',
    'Calls',
    'Birthdays',
  ];

  const simpleOptions = [
    'Posts, stories and comments',
    'Messages',
    'Live and reels',
    'From system',
  ];

  const handleOptionPress = (option: string) => {
    if (detailedOptions.includes(option)) {
      navigation.navigate('NotificationOption', {
        optionKey: option,
        title: option,
      });
    }
  };

  const renderNotificationOption = (title: string, subtitle?: string, hasSwitch?: boolean) => {
    return (
      <TouchableOpacity
        key={title}
        style={styles.optionRow}
        disabled={hasSwitch}
        onPress={hasSwitch ? undefined : () => handleOptionPress(title)}
      >
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
          )}
        </View>
        {hasSwitch ? (
          <Switch
            value={pauseAll}
            onValueChange={setPauseAll}
            trackColor={{ false: styles.switchTrack.backgroundColor, true: styles.switchTrackActive.backgroundColor }}
            thumbColor={pauseAll ? styles.switchThumbActive.backgroundColor : styles.switchThumb.backgroundColor}
          />
        ) : (
          <Image
            source={require('../../../../assets/icon/right.png')}
            style={[styles.rightIcon, { resizeMode: 'contain' }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../../../assets/icon/left.png')}
              style={[styles.backIcon, { resizeMode: 'contain' }]}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Notification Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bellIconContainer}>
            <Image
              source={require('../../../../assets/icon/bell.png')}
              style={[styles.bellIcon, { resizeMode: 'contain' }]}
            />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>
              Turn on notifications from your device settings to see updates on your lock screen.
            </Text>
            <Text style={styles.bannerLink}>Go to device settings</Text>
          </View>
        </View>

        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push notifications</Text>
          
          {renderNotificationOption(
            'Pause all',
            'temporarily pause notifications',
            true
          )}
          
          {renderNotificationOption(
            'Sleep mode',
            'Automatically mute notifications at night or whenever you need to focus.'
          )}
          
          {[...detailedOptions, ...simpleOptions].map(option => renderNotificationOption(option))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
