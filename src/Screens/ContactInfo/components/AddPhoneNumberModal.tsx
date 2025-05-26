import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {CheckSquare, Square} from 'lucide-react-native';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
interface AccountItem {
  id: string;
  name: string;
  platform: 'Facebook' | 'Instagram';
  image: string;
  warning?: string;
}

interface AddPhoneModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (phone: string) => void;
}

const dummyAccounts: AccountItem[] = [
  {
    id: '1',
    name: 'Hoàng Công Nhựt Việt',
    platform: 'Facebook',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'HelloKitty',
    platform: 'Instagram',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    warning:
      'Adding this number will replace +8123456789 on this Instagram account.',
  },
];

export const AddPhoneModal: React.FC<AddPhoneModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const [phone, setPhone] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(phone);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                {backgroundColor: color.background},
              ]}>
              <Text style={[styles.title, {color: color.text}]}>
                Add a mobile number
              </Text>
              <Text style={[styles.description]}>
                We’ll use this number across all of your accounts in Accounts
                Center to personalize experiences, like connecting people and
                improving ads on our products.
              </Text>

              <Text style={[styles.label, {color: color.text}]}>
                Vietnam(+84)
              </Text>
              <TextInput
                placeholder="Enter mobile number"
                placeholderTextColor={color.text}
                style={[styles.input, {color: color.text}]}
                keyboardType="numeric"
                value={phone}
                maxLength={11}
                onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))}
              />
              <Text style={[styles.note, {color: color.text}]}>
                You may receive WhatsApp and SMS notifications from us.
              </Text>

              <Text style={[styles.label, {color: color.text}]}>
                Choose accounts for this number
              </Text>
              <View style={{flex: 1}}>
                <FlashList
                  data={dummyAccounts}
                  estimatedItemSize={80}
                  extraData={selectedAccountId}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.accountRow}
                      onPress={() => setSelectedAccountId(item.id)}>
                      <Image source={{uri: item.image}} style={styles.avatar} />
                      <View style={{marginLeft: 10, flex: 1}}>
                        <Text style={[styles.accountName, {color: color.text}]}>
                          {item.name}
                        </Text>
                        <Text
                          style={[styles.accountPlatform, {color: color.text}]}>
                          {item.platform}
                        </Text>
                        {item.warning && (
                          <Text style={styles.warningText}>{item.warning}</Text>
                        )}
                      </View>
                      {selectedAccountId === item.id ? (
                        <CheckSquare size={20} color={color.text} />
                      ) : (
                        <Square size={20} color={color.text} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
  },
  note: {
    fontSize: 12,

    marginTop: 6,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 12,
  },
  accountName: {
    fontWeight: '600',
    fontSize: 14,
  },
  accountPlatform: {
    fontSize: 12,
  },
  warningText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
    maxWidth: '95%',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1877f2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
