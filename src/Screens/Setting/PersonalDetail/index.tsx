import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {X, ChevronRight} from 'lucide-react-native';

interface PersonalDetailsProps {
  isVisible: boolean;
  onClose: () => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  isVisible,
  onClose,
}) => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    closeButton: {
      paddingLeft: 8,
    },
    title: {
      marginBottom: 24,
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginRight: 32,
    },
    content: {
      padding: 16,
    },
    description: {
      color: colors.text,
      fontSize: 14,
      marginBottom: 24,
    },
    section: {
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuText: {
      flex: 1,
      color: colors.text,
    },
    menuValue: {
      color: colors.text,
      opacity: 0.5,
      marginRight: 8,
    },
  });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Personal details</Text>
          <Text style={styles.description}>
            Cirla uses this information to verify your identity and to keep our
            community safe. You decide what personal details you make visible to
            others.
          </Text>

          <View style={styles.section}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Contact info</Text>
              <Text style={styles.menuValue}>Hugh@gmail.com</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Birthday</Text>
              <Text style={styles.menuValue}>January 1, 1990</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Identity confirmation</Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Account ownership and control</Text>
              <Text style={styles.menuValue} numberOfLines={2}>
                Manage your data, modify your legacy contact, deactivate or
                delete your accounts and profiles.
              </Text>
              <ChevronRight size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PersonalDetails;
