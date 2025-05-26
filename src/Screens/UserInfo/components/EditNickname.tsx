import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';
import UserInfoStyles from '../../../StyleSheet/UserInfoStyles';
import { getUserById, currentUser, User } from '../../../MockData/message.mock';

export const EditNickname = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { theme } = useTheme();
  const color = Colors[theme];
  const styles = UserInfoStyles(theme);
  const modalRef = useRef<Modalize>(null);

  const userId: string = String(route.params?.userId ?? '1');
  const chatUsers: User[] = [getUserById(userId)!, currentUser];

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  const onUserPress = (user: User) => {
    setSelectedUser(user);
    setNewNickname('');
    setModalOpen(true);
    openModal();
    // console.log(user.name);
  };
  const openModal = () => {
    modalRef.current?.open();
    setModalOpen(true);
  };

  const closeModal = () => {
    modalRef.current?.close();
    setModalOpen(false);
  };

  const handleDone = () => {
    // commit the nickname change. for now, just close
    closeModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Image
            source={require('../../../../assets/icon/left.png')}
            style={styles.iconSmall}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nicknames</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Info container */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Nicknames are only visible in this chat.</Text>
        <Text style={styles.infoLink}>Change who can edit your nickname</Text>
      </View>

      {/* Users list */}
      <View style={styles.listContainer}>
        {chatUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userRow}
            onPress={() => onUserPress(user)}
          >
            <Image source={{ uri: user.img }} style={styles.avatarSmall} />
            <View style={[styles.userTextContainer]}>
              <Text style={[styles.userName, { color: 'black'}]}>{user.name}</Text>
              <Text style={[styles.userNickname, { color: 'black' }]}>{user.name}</Text>
            </View>
            <Image
              source={require('../../../../assets/icon/right.png')}
              style={styles.rightArrowSmall}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Nickname edit modal */}
      <Portal>
        <Modalize
          ref={modalRef}
          handlePosition="inside"
          panGestureEnabled
          adjustToContentHeight
          handleStyle={styles.modalHandle}
          modalStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit nickname</Text>
            <TouchableOpacity
              disabled={!newNickname}
              onPress={handleDone}
            >
              <Text
                style={[
                  styles.modalDone,
                  !newNickname && styles.modalDoneDisabled,
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {selectedUser && <Image source={{ uri: selectedUser.img }} style={styles.avatarLarge} />}
            
            <View style={{ width: '100%', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ color: color.textSecondary, fontSize: 12 }}>Nickname</Text>
                <Text style={{ color: color.textSecondary, fontSize: 12 }}>{newNickname.length}/32</Text>
              </View>
              <TextInput
                style={[styles.textInput, { paddingTop: 12 }]} 
                maxLength={32}
                value={newNickname}
                onChangeText={setNewNickname}
                placeholder="Enter nickname"
              />
            </View>
            
            <Text style={styles.modalInfo}>Everyone in the chat will see this nickname.</Text>
          </View>
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
};