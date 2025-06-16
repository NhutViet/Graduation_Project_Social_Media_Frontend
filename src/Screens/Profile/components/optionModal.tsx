import React, { forwardRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions} from "react-native";
import { Modalize } from "react-native-modalize";
import { Colors } from '../../../../assets/color/Colors';
import { useTheme } from '../../../util/ThemeContext';
import { relationAction } from '../../../../services/relationRedux/relationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../services/store';

interface OptionModalProps {
  userID: string;
  isBlock: boolean;
  onBlockChange: (newState: boolean) => void;
}

const modalContentHeight = Dimensions.get('window').height * 0.4;

const optionModal = forwardRef<Modalize, OptionModalProps>(
    ({ userID, isBlock: initialIsBlock, onBlockChange }, ref) => {
        const {theme} = useTheme();
        const color = Colors[theme];
        const dispatch = useDispatch<AppDispatch>();
        const [isBlock, setIsBlock] = useState(initialIsBlock);

        useEffect(() => {
            setIsBlock(initialIsBlock);
        }, [initialIsBlock]);

        const toggleBlock = async () => {
            const actionType = isBlock ? 'unblock' : 'block';
            setIsBlock(!isBlock)
            onBlockChange(!isBlock)
            try {
                await dispatch(
                relationAction({
                    targetId: userID,
                    action: actionType,
                }),
                ).unwrap();
            } catch (error) {
                Alert.alert(
                    `${actionType === 'block' ? 'Chặn' : 'Bỏ chặn'} thất bại`,
                    'Vui lòng thử lại sau.',
                );
                setIsBlock(isBlock)
                onBlockChange(isBlock)
            }
        };

        return (
        <Modalize
            ref={ref}
            adjustToContentHeight
            handleStyle={[styles.handle, {backgroundColor: color.backgroundSecondary}]}
            modalStyle={[styles.modal, {backgroundColor: color.modal}]}
            handlePosition="inside"
            panGestureEnabled={true}
        >
            <View style={[styles.content, {height: modalContentHeight}]}>
            <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Hạn chế</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={toggleBlock}>
                <Text style={styles.optionText}>{isBlock ? "Bỏ chặn" : "Chặn"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Báo cáo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
                <Text style={[styles.optionText, {color: color.text}]}>Sao chép URL Trang cá nhân</Text>
            </TouchableOpacity>
            </View>
        </Modalize>
        );
    }
) 
export default optionModal

const styles = StyleSheet.create({
    modal: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    handle: {
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
    },
    optionText: {
        fontSize: 16,
        color: "red",
    },
})