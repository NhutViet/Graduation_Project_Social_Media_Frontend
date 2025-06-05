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

interface AddEmailProps {
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
  },
];

export const AddEmailModal: React.FC<AddEmailProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const {theme} = useTheme();
  const color = Colors[theme];
  const handleSubmit = () => {
    onSubmit(email);
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
                Thêm địa chỉ email
              </Text>
              <Text style={styles.description}>
                Chúng tôi sẽ sử dụng địa chỉ email này cho tất cả tài khoản của bạn trong Trung tâm Tài khoản để cá nhân hóa trải nghiệm, như kết nối mọi người và cải thiện quảng cáo trên các sản phẩm của chúng tôi.
              </Text>

              <TextInput
                placeholder="Enter email address"
                placeholderTextColor={color.text}
                style={[styles.input, {color: color.text}]}
                value={email}
                maxLength={11}
                onChangeText={setEmail}
              />
              <Text style={styles.note}>
                Bạn có thể nhận được thông báo qua WhatsApp và SMS từ chúng tôi.
              </Text>

              <Text style={[styles.label, {marginTop: 20}]}>
                Chọn tài khoản cho số này
              </Text>
              <Text style={styles.description}>
                Các tài khoản bạn chọn thêm email này sẽ sử dụng nó để giúp bạn đăng nhập và nhận thông báo từ chúng tôi.
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
                <Text style={styles.buttonText}>Tiếp theo</Text>
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
    color: '#555',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
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
    color: '#888',
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
    color: '#555',
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
