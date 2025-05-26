import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {ChevronLeft} from 'lucide-react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {AddPhoneModal} from './components/AddPhoneNumberModal';
import {AddEmailModal} from './components/AddEmailModal';
export const ContactInfo = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];

  const [visibleModalPhoneNumber, setVisibleModalPhoneNumber] = useState(false);
  const [visibleModalEmail, setVisibleModalEmail] = useState(false);
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.onBack()}>
            <ChevronLeft size={30} color={color.text} />
          </TouchableOpacity>
          <Text style={[styles.textHeader, {color: color.text}]}>
            Which would you like to add?
          </Text>
        </View>
        <View style={styles.mid}>
          <TouchableOpacity
            style={styles.viewNumber}
            onPress={() => setVisibleModalPhoneNumber(true)}>
            <Text style={styles.txtNumber}>Add mobile number</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewEmail}
            onPress={() => setVisibleModalEmail(true)}>
            <Text style={styles.txtNumber}>Add Email</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AddPhoneModal
        visible={visibleModalPhoneNumber}
        onClose={() => setVisibleModalPhoneNumber(false)}
        onSubmit={({phoneNumber, accountId}: any) => {
          console.log('Phone:', phoneNumber);
          console.log('Selected Account ID:', accountId);
          setVisibleModalPhoneNumber(false);
        }}
      />
      <AddEmailModal
        visible={visibleModalEmail}
        onClose={() => setVisibleModalEmail(false)}
        onSubmit={({phoneNumber, accountId}: any) => {
          console.log('Phone:', phoneNumber);
          console.log('Selected Account ID:', accountId);
          setVisibleModalEmail(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  header: {
    marginTop: 15,
  },
  textHeader: {
    fontSize: 25,
    marginTop: 15,
  },
  mid: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  viewNumber: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 15,
  },
  viewEmail: {
    padding: 15,
  },
  txtNumber: {
    fontSize: 16,
    color: '#007fff',
    fontWeight: '500',
  },
});
