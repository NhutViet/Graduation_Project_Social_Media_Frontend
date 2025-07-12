import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useNotificationSettingsStyles} from '../../../../StyleSheet/NotificationSetingsStyles';
import {ArrowLeft} from 'lucide-react-native';

interface RouteParams {
  optionKey: string;
  title: string;
}

const notificationOptions: {
  [key: string]: {
    sectionTitle: string;
    choices: string[];
    subText?: string;
  };
} = {
  // Sample config (you should define this outside or pass in)
  likes: {
    sectionTitle: 'Thông báo khi có lượt thích:',
    choices: ['Mọi người', 'Chỉ người theo dõi bạn', 'Tắt'],
    subText: 'Bạn sẽ không nhận thông báo về lượt thích nếu tắt.',
  },
};

export const NotificationOption = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const {optionKey, title} = route.params as RouteParams;
  const styles = useNotificationSettingsStyles();

  const config = notificationOptions[optionKey];
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  if (!config) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Không tìm thấy tùy chọn cho: {optionKey}</Text>
      </SafeAreaView>
    );
  }

  const renderRadioButton = (choice: string, isSelected: boolean) => (
    <TouchableOpacity
      key={choice}
      style={styles.optionRow}
      onPress={() => setSelectedChoice(choice)}>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{choice}</Text>
      </View>
      <View
        style={[
          styles.radioOuter,
          {
            borderColor: isSelected
              ? styles.radioSelected.borderColor
              : styles.radioUnselected.borderColor,
          },
        ]}>
        {isSelected && (
          <View
            style={[
              styles.radioInner,
              {backgroundColor: styles.radioSelected.borderColor},
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}>
            <ArrowLeft size={22} color={styles.headerTitle.color || '#000'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{config.sectionTitle}</Text>
          {config.choices.map(choice =>
            renderRadioButton(choice, selectedChoice === choice),
          )}
        </View>

        {/* SubText */}
        {config.subText && (
          <View style={styles.subTextContainer}>
            <Text style={styles.subText}>{config.subText}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
