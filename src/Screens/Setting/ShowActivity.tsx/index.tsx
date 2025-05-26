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

export const ShowActivity = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const mColor = Colors[theme] || Colors;
  const styles = createStyles(theme);
  const [isActive, setIsActive] = useState(false);

  const handleShowActivityToogle = async () => {
    try {
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error('Failed to update privacy settings:', errorData);
      //   Alert.alert('Failed', 'Unable to update privacy status');
      //   return;
      // }
      setIsActive(!isActive);
      Alert.alert(
        'Success',
        `Switch to ${!isActive ? 'online' : 'offline'} mode`,
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
        <Text style={styles.headTitle}>Show activity status</Text>
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
              Show activity status
            </Text>
            <Switch
              value={isActive}
              onValueChange={handleShowActivityToogle}
              trackColor={{
                false: mColor.border,
                true: mColor.blue,
              }}
              thumbColor={mColor.white}
            />
          </View>
          <Text style={styles.privacyDescription}>
            Allow accounts you follow and anyone you message to see when you
            were last active or are currently active on Instagram apps. When
            this is turned off, you won't be able to see the activity status of
            other accounts.
            <Text style={styles.learnMore}>Learn more.{'\n'}</Text>
            {'\n'}
            <Text style={styles.privacyDescription}>
              You can continue to use our services if active status is off..
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
