import React, { forwardRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions} from "react-native";
import { Modalize } from "react-native-modalize";
import { relationAction } from '../../../../services/relationRedux/relationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../services/store';

interface OptionModalProps {
  userID: string;
}

const options = [
    {
      id: "restrict",
      label: "Hạn chế",
      action: (userID: string) => Alert.alert(`Hạn chế người dùng ${userID}`),
    },
    {
      id: "block",
      label: "Chặn",
      action: (userID: string) => Alert.alert(`Chặn người dùng ${userID}`),
    },
    {
      id: "report",
      label: "Báo cáo",
      action: (userID: string) => Alert.alert(`Báo cáo người dùng ${userID}`),
    },
    {
      id: "copyLink",
      label: "Sao chép URL Trang cá nhân",
      action: () => Alert.alert("URL đã được sao chép!"),
    },
  ];

const optionModal = forwardRef<Modalize, OptionModalProps>(
    ({ userID }, ref) => {
        const handleRestrict = () => {
        Alert.alert("Hạn chế", `Người dùng với ID: ${userID} đã bị hạn chế.`);
        };

        const handleBlock = () => {
        Alert.alert("Chặn", `Người dùng với ID: ${userID} đã bị chặn.`);
        };

        const handleReport = () => {
        Alert.alert("Báo cáo", `Người dùng với ID: ${userID} đã được báo cáo.`);
        };

        const handleCopyLink = () => {
        Alert.alert("Sao chép URL", "URL trang cá nhân đã được sao chép!");
        };
        return (
        <Modalize
            ref={ref}
            modalHeight={Dimensions.get('window').height * 0.4}
            handleStyle={styles.handle}
            modalStyle={styles.modal}
            handlePosition="inside"
            panGestureEnabled={true}
        >
            <View style={styles.content}>
          <TouchableOpacity style={styles.option} onPress={handleRestrict}>
            <Text style={styles.optionText}>Hạn chế</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleBlock}>
            <Text style={styles.optionText}>Chặn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleReport}>
            <Text style={styles.optionText}>Báo cáo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleCopyLink}>
            <Text style={styles.optionText}>Sao chép URL Trang cá nhân</Text>
          </TouchableOpacity>
        </View>
        </Modalize>
        );
    }
) 
export default optionModal

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    handle: {
        backgroundColor: '#ccc',
        height: 4,
        width: 50,
        alignSelf: 'center',
        borderRadius: 2,
    },
    content: {
        padding: 20,
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
})