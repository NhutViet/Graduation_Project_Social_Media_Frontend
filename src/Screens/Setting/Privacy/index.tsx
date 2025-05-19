import {
  Alert,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {createStyles} from '../../../StyleSheet/Setting.Styles';
import {ChevronLeft} from 'lucide-react-native';

export const Privacy = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const mColor = Colors[theme] || Colors;
  const styles = createStyles(mColor);
  const [isPrivate, setIsPrivate] = useState(false);

  const handlePrivacyToogle = async () => {
    try {
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error('Failed to update privacy settings:', errorData);
      //   Alert.alert('Failed', 'Unable to update privacy status');
      //   return;
      // }
      setIsPrivate(!isPrivate);
      Alert.alert(
        'Success',
        `Switch to ${!isPrivate ? 'private' : 'public'} mode`,
      );
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ChevronLeft size={30} color={mColor.text} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>Account Privacy</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.privacyContainer,
            {backgroundColor: mColor.background},
          ]}>
          <View style={styles.privacyHeader}>
            <Text style={[styles.privacyTitle, {color: mColor.text}]}>
              Private Account
            </Text>
            <Switch
              value={isPrivate}
              onValueChange={handlePrivacyToogle}
              trackColor={{
                false: mColor.border,
                true: mColor.blue,
              }}
              thumbColor={mColor.white}
            />
          </View>
          <Text style={styles.privacyDescription}>
            When your account is private, only people you approve can see your
            photos and videos. Your existing followers won't be affected.{' '}
            <Text style={styles.learnMore}>Learn more</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
