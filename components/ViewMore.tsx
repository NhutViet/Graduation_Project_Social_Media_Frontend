import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../src/util/ThemeContext';
import {Colors} from '../assets/color/Colors';
import {
  Bookmark,
  RefreshCw,
  Star,
  UserMinus,
  User,
  Info,
  Eye,
  Flag,
} from 'lucide-react-native';
import {Dimensions} from 'react-native';

interface PostMoreOptionProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
}

export const ViewMore: React.FC<PostMoreOptionProps> = ({visible, onClose}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable
        style={[styles.modalContainer, {backgroundColor: 'rgba(0,0,0,0.5)'}]}
        onPress={onClose}>
        <View
          style={[styles.modalContent, {backgroundColor: color.background}]}>
          <View style={[styles.content, {backgroundColor: color.background}]}>
            {/* Top actions */}
            <View style={[styles.topActions]}>
              <TouchableOpacity
                style={[
                  styles.topActionButton,
                  styles.actionContainer,
                  {
                    backgroundColor: color.gray,
                  },
                ]}>
                <Bookmark size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Lưu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.topActionButton,
                  styles.actionContainer,
                  {
                    backgroundColor: color.gray,
                  },
                ]}>
                <RefreshCw size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Remix
                </Text>
              </TouchableOpacity>
            </View>

            {/* List actions */}
            <View
              style={[
                styles.additionalActionsContainer,
                {backgroundColor: color.gray},
              ]}>
              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <Star size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Thêm vào mục yêu thích
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <UserMinus size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Bỏ theo dõi
                </Text>
              </TouchableOpacity>
            </View>

            {/* Additional actions */}
            <View
              style={[
                styles.additionalActionsContainer,
                {backgroundColor: color.gray},
              ]}>
              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <User size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Giới thiệu về tài khoản này
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <Info size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Tại sao tôi thấy bài viết này ?
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <Eye size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Ẩn
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <Flag size={24} color={color.error} />
                <Text style={[styles.actionText, {color: color.error}]}>
                  Báo cáo bài viết
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    height: Dimensions.get('window').height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    margin: Dimensions.get('window').width * 0.05,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Dimensions.get('window').height * 0.02,
    width: '100%',
  },
  topActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: Dimensions.get('window').height * 0.02,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimensions.get('window').height * 0.015,
    gap: Dimensions.get('window').width * 0.04,
  },
  actionText: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: Dimensions.get('window').height * 0.01,
  },
  actionContainer: {
    borderRadius: Dimensions.get('window').width * 0.02,
    padding: Dimensions.get('window').width * 0.025,
  },
  additionalActionsContainer: {
    width: '100%',
    borderRadius: Dimensions.get('window').width * 0.02,
    padding: Dimensions.get('window').width * 0.025,
    marginTop: Dimensions.get('window').height * 0.01,
  },
});

export default ViewMore;
