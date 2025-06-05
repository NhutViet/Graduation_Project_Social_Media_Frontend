import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../../util/ThemeContext';
import { useNotificationSettingsStyles } from '../../../../StyleSheet/NotificationSetingsStyles';
import { notificationOptions } from '../NotificationConfig';

interface RouteParams {
  optionKey: string;
  title: string;
}

export const NotificationOption = () => {
  const { theme } = useTheme();
  const navigation: any = useNavigation();
  const route = useRoute();
  const { optionKey, title } = route.params as RouteParams;
  const styles = useNotificationSettingsStyles();
  
  const config = notificationOptions[optionKey];
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  if (!config) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Chỉnh sửa không tìm thấy cho {optionKey}</Text>
      </SafeAreaView>
    );
  }

  const renderRadioButton = (choice: string, isSelected: boolean) => {
    return (
      <TouchableOpacity
        key={choice}
        style={styles.optionRow}
        onPress={() => setSelectedChoice(choice)}
      >
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{choice}</Text>
        </View>
        <View style={[
          styles.radioOuter,
          { borderColor: isSelected ? styles.radioSelected.borderColor : styles.radioUnselected.borderColor }
        ]}>
          {isSelected && (
            <View style={[
              styles.radioInner,
              { backgroundColor: styles.radioSelected.borderColor }
            ]} />
          )}
        </View>
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
              source={require('../../../../../assets/icon/left.png')}
              style={[styles.backIcon, { resizeMode: 'contain' }]}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Options Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{config.sectionTitle}</Text>
          
          {config.choices.map(choice => 
            renderRadioButton(choice, selectedChoice === choice)
          )}
        </View>

        {/* Sub Text */}
        <View style={styles.subTextContainer}>
          <Text style={styles.subText}>{config.subText}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};