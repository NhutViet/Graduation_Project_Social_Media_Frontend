import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import { Share } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import {Portal} from 'react-native-portalize';
import LinkQRModal from './components/LinkQRModal';


export const LinkToGroup = () => {
  const navigation: any = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [linkQR, setLinkQR] = useState('https://quickchart.io/qr?text=Hello world', );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLinkEnabled, setIsLinkEnabled] = useState(true);
  const inviteLink = "https://abc";

  const toggleLink = () => setIsLinkEnabled(!isLinkEnabled);

  const copyToClipboard = () => {
    Clipboard.setString(inviteLink);
 };

  const shareLink = async () => {
    try {
      await Share.share({
        message: inviteLink,
      });
    } catch (error) {
      
    }
  };

  const resetLink = () => {
    console.log("Reset link triggered");
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
     <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: color.background, height: Dimensions.get('window').height * 0.1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{width: 20, height: 20, marginLeft: 20, zIndex: 1}}>
                <Image source={require('../../../assets/icon/left.png')} style={{resizeMode: 'contain', width: '100%', height: '100%'}}/>
            </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
            <Text style={[styles.header, {color: color.text}]}>Invite link</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center',}}></View>
      </View>
      <View style={{marginBottom: 16, paddingHorizontal: 20}}>
            <Text style={{fontSize: 17, color: color.text}}>Invite link</Text>
            <View style={styles.linkRow}>
                <Text style={styles.linkText}>{inviteLink}</Text>
                <Switch value={isLinkEnabled} onValueChange={toggleLink} thumbColor={color.background} trackColor={{ false: color.textSecondary, true: color.text }}/>
            </View>
            <View style={{flexDirection: 'row', marginTop: 8,}}>
                <Text style={{color: color.textSecondary}}>Anyone can join your group chat with this link. <TouchableOpacity><Text style={styles.learnMore}>Learn more</Text></TouchableOpacity></Text>
            </View>
        </View>

        <View style={{width: '100%', borderWidth: 3, borderColor: color.gray}}/>

        <TouchableOpacity style={styles.row} onPress={copyToClipboard}>
            <Image source={require('../../../assets/icon/copy.png')} style={styles.icon} />
            <Text style={styles.rowText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
            <Image source={require('../../../assets/icon/share.png')} style={styles.icon} />
            <Text style={styles.rowText}>Send in Instagram</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => setModalVisible(true)}>
            <Image source={require('../../../assets/icon/qrlink.png')} style={styles.icon} />
            <Text style={styles.rowText}>QR code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
            <Image source={require('../../../assets/icon/upload.png')} style={styles.icon} />
            <Text style={styles.rowText}>Share</Text>
        </TouchableOpacity>

        <View style={{width: '100%', borderWidth: 3, borderColor: color.gray}}/>

        <TouchableOpacity style={styles.row}>
            <Image source={require('../../../assets/icon/repost.png')} style={[styles.icon, {tintColor: '#dd0131'}]} />
            <Text style={styles.resetText}>Reset link</Text>
        </TouchableOpacity>
        <Portal>
            <LinkQRModal
                isVisible={isModalVisible}
                onClose={closeModal}
                groupAvatarUrl='https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg'
                qrCodeValue={linkQR}
                groupName="grName"
                membersCount={3}
            />
        </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontWeight: "600",
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 16,
        color: '#007aff',
    },
    learnMore: {
        color: '#007aff',
        textDecorationLine: 'underline',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20
    },
    rowText: {
        marginLeft: 8,
        fontSize: 16,
    },
    resetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 16,
    },
    resetText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#dd0131',
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
})