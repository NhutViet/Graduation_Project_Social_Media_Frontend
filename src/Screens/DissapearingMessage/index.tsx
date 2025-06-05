import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, SafeAreaView } from "react-native";
import Header from '../../../components/Header'
import {Colors} from '../../../assets/color/Colors'
import {useTheme} from '../../util/ThemeContext'
import {useNavigation} from '@react-navigation/native';

export const DissapearingMessage = () => {
    const navigation: any = useNavigation();
    const {theme} = useTheme();
    const color = Colors[theme];
    const [selectedOption, setSelectedOption] = useState("Off");

    const options = [
        { label: "Tắt", value: "Off", onPress: () => Alert.alert("Option selected: Off") },
        { label: "Sau khi đã xem", value: "OnceThey'reSeen", onPress: () => Alert.alert("Option selected: OnceThey'reSeen") },
        { label: "24 giờ", value: "24Hours", onPress: () => Alert.alert("Option selected: 24 hours") },
        { label: "7 ngày", value: "7Days", onPress: () => Alert.alert("Option selected: 7 days") },
    ];

    const handleSelectOption = (option: { value: string; onPress: () => void }) => {
        setSelectedOption(option.value);
        option.onPress();
    };

    const renderOption = ({ item }: { item: { label: string; value: string; onPress: () => void } }) => (
        <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleSelectOption(item)}
        >
            <Text style={{fontSize: 16, color: color.text}}>{item.label}</Text>
            <View style={[styles.radioCircle, {borderColor: color.text}]}>
                {selectedOption === item.value && <View style={[styles.selectedCircle, {backgroundColor: color.text}]} />}
            </View>
        </TouchableOpacity>
    );
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: color.background}]}>
        <View style={{width: '100%', height: 60}}>
            <Header
                title="Dissapearing messages"
                iconBack={require('../../../assets/icon/left.png')}
                func={() => navigation.goBack()}
                navigation={navigation}
            />
        </View>
        <View style={{width: '100%', height: '100%'}}>
            <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={renderOption}
            ListFooterComponent={
                <Text style={[styles.description, {color: color.textSecondary}]}>
                Đặt tin nhắn và phản hồi biến mất sau khi bạn đã xem và đóng trò chuyện hoặc giữ chúng lâu hơn một chút. Tin nhắn và phản hồi có thể được giữ lại trong trò chuyện tối đa 7 ngày sau khi tin nhắn được gửi. Nếu phát hiện ảnh chụp màn hình, trò chuyện sẽ nhận được thông báo. <Text onPress={() => {Alert.alert('navigate')}} style={{fontSize: 14, color: "#007AFF",}}>Tìm hiểu thêm</Text>
                </Text>
            }
            />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    optionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
    },
    optionText: {
            },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'justify',
        marginTop: 20
    },
})