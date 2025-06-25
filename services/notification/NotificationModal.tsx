import React from 'react';
import {Modal, Text, View, Button} from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
  onAction?: () => void;
}

const NotificationModal = ({
  visible,
  title,
  body,
  onClose,
  onAction,
}: Props) => (
  <Modal visible={visible} transparent animationType="fade">
    <View
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#00000099'}}>
      <View
        style={{
          margin: 20,
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 10,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>{title}</Text>
        <Text style={{marginTop: 10}}>{body}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 20,
          }}>
          <Button title="Đóng" onPress={onClose} />
          {onAction && <Button title="Đi đến" onPress={onAction} />}
        </View>
      </View>
    </View>
  </Modal>
);

export default NotificationModal;
