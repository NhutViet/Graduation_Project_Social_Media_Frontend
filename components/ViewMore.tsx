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
        style={[styles.modalContainer, {backgroundColor: 'rgba(0,0,0,0.5)'}]} // Giữ nguyên màu overlay
        onPress={onClose}>
        <View
          style={[styles.modalContent, {backgroundColor: color.background}]}>
          <View style={[styles.content, {backgroundColor: color.background}]}>
            {/* Top actions */}
            <View style={[styles.topActions]}>
              <Pressable
                style={({pressed}) => [
                  styles.topActionButton,
                  styles.actionContainer,
                  styles.halfWidth,
                  {
                    backgroundColor: color.gray,
                    opacity: pressed ? 0.8 : 0.9,
                  },
                ]}>
                <Bookmark size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Bookmark
                </Text>
              </Pressable>

              <Pressable
                style={({pressed}) => [
                  styles.topActionButton,
                  styles.actionContainer,
                  styles.halfWidth,
                  {
                    backgroundColor: color.gray,
                    opacity: pressed ? 0.8 : 0.9,
                  },
                ]}>
                <RefreshCw size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Remix
                </Text>
              </Pressable>
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
                  Adding to favorite
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <UserMinus size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Unfollow
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
                  This account info
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <Info size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Why am I seeing this post
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <Eye size={24} color={color.text} />
                <Text style={[styles.actionText, {color: color.text}]}>
                  Hide
                </Text>
              </TouchableOpacity>

              <View style={[styles.divider, {backgroundColor: color.border}]} />

              <TouchableOpacity
                style={[styles.actionItem, styles.actionContainer]}>
                <Flag size={24} color={color.error} />
                <Text style={[styles.actionText, {color: color.error}]}>
                  Report this post
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
    height: Dimensions.get('window').height * 0.7, // 70% chiều cao màn hình
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    margin: Dimensions.get('window').width * 0.05, // 5% chiều rộng màn hình
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Dimensions.get('window').height * 0.02,
    paddingHorizontal: Dimensions.get('window').width * 0.03,
  },
  topActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.45, // 45% chiều rộng màn hình
    paddingVertical: Dimensions.get('window').height * 0.02, // 2% chiều cao màn hình
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimensions.get('window').height * 0.015, // 1.5% chiều cao màn hình
    gap: Dimensions.get('window').width * 0.04, // 4% chiều rộng màn hình
  },
  actionText: {
    fontSize: Dimensions.get('window').width * 0.04, // 4% chiều rộng màn hình
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: Dimensions.get('window').height * 0.01, // 1% chiều cao màn hình
  },
  actionContainer: {
    borderRadius: Dimensions.get('window').width * 0.02,
    padding: Dimensions.get('window').width * 0.025,
  },
  additionalActionsContainer: {
    borderRadius: Dimensions.get('window').width * 0.02,
    padding: Dimensions.get('window').width * 0.025,
    marginTop: Dimensions.get('window').height * 0.01,
  },
  halfWidth: {
    width: Dimensions.get('window').width * 0.45, // 45% chiều rộng màn hình
    marginHorizontal: Dimensions.get('window').width * 0.02, // 2% khoảng cách hai bên
  },
});

export default ViewMore;
