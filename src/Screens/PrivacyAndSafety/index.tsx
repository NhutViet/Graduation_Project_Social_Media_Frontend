import React, {useState} from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Info, Ban, Bug } from 'lucide-react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
import Header from '../../../components/Header';

export const PrivacyAndSafety = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [readReceipts, setReadReceipts] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const toggleReadReceipts = () => setReadReceipts(!readReceipts);
  const toggleTypingIndicator = () => setTypingIndicator(!typingIndicator);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: color.background}]}>
      <View style={{width: '100%', height: 60}}>
        <Header
            title="Privacy & safety"
            iconBack={require('../../../assets/icon/left.png')}
            func={() => navigation.goBack()}
            navigation={navigation}
        />
      </View>

      <ScrollView contentContainerStyle={[styles.content, {backgroundColor: color.background}]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>username...</Text>
          <TouchableOpacity style={styles.row}>
            <Info style={styles.rowIcon} size={24} color={color.text} />
            <Text style={[styles.rowText, {color: color.text}]}>About this account</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Image style={{tintColor: color.textSecondary}} source={require('../../../assets/icon/right.png')}/>
            </View>
          </TouchableOpacity>
        </View>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Keeping your messages secure</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={[styles.rowText, {color: color.text}]}>Use end-to-end encryption</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Who can see your activity</Text>
          <View style={styles.switchRow}>
            <Text style={[styles.rowText, {color: color.text}]}>Read receipts</Text>
            <Switch  value={readReceipts} onValueChange={toggleReadReceipts} thumbColor={color.text} trackColor={{ false: color.textSecondary, true: color.text }} />
          </View>
          <Text style={[styles.note, {color: color.textSecondary}]}>
            Others can see when you've read their messages. {"\n \n"}
            Disappearing messages always send read receipts.
          </Text>
          <View style={styles.switchRow}>
            <Text style={[styles.rowText, {color: color.text}]}>Typing indicator</Text>
            <Switch value={typingIndicator} onValueChange={toggleTypingIndicator} thumbColor={color.text} trackColor={{ false: color.textSecondary, true: color.text }}/>
          </View>
          <Text style={[styles.note, {color: color.textSecondary}]}>
            Others can see when you're typing.
          </Text>
        </View>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Who can reach you</Text>
          <TouchableOpacity style={styles.row}>
            <Image style={[styles.rowIcon, {tintColor: color.text}]} source={require('../../../assets/icon/block-user.png')}/>
            <Text style={[styles.rowText, {color: color.text}]}>Restrict</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Image style={{tintColor: color.textSecondary}} source={require('../../../assets/icon/right.png')}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ban style={styles.rowIcon} size={24} color="red" />
            <Text style={[[styles.rowText, {color: color.text}], { color: 'red' }]}>Block</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Image style={{tintColor: color.textSecondary}} source={require('../../../assets/icon/right.png')}/>
            </View>
          </TouchableOpacity>
        </View>

        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: color.text}]}>Support</Text>
          <TouchableOpacity style={styles.row}>
            <Image style={styles.rowIcon} source={require('../../../assets/icon/report.png')}/>
            <Text style={[[styles.rowText, {color: color.text}], { color: 'red' }]}>Report</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Image style={{tintColor: color.textSecondary}} source={require('../../../assets/icon/right.png')}/>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    rowIcon: {
        marginRight: 12
    },
    rowText: {
        fontSize: 14,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    note: {
        width: 250,
        fontSize: 12,
        color: '#888',
        marginTop: -16,
        marginBottom: 8,
    },
})