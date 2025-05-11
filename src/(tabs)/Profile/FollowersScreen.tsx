import { StyleSheet, Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import Header from '../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import FollowersTab from './FollowersTab';
import FollowingTab from './FollowingTab';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';

const TopTab = createMaterialTopTabNavigator();

const FollowersScreen = () => {
    const navigation: any = useNavigation();
    const {theme} = useTheme();
    const color = Colors[theme];
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
        <Header
            title="username..."
            iconBack={require('../../../assets/icon/left.png')}
            func={() => navigation.goBack()}
            navigation={navigation} />
        <TopTab.Navigator
            screenOptions={{
                tabBarLabelStyle:{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textTransform: 'lowercase'
                },
                tabBarStyle:{
                    backgroundColor: color.background
                },
                tabBarIndicatorStyle:{
                    backgroundColor: color.text,
                    height: 3
                },
                tabBarActiveTintColor: color.text,
                tabBarInactiveTintColor: color.textSecondary,
            }}>
            <TopTab.Screen name="FollowersTab" component={FollowersTab} options={{title: "followers"}}/>
            <TopTab.Screen name="FollowingTab" component={FollowingTab} options={{title: "following"}}/>
        </TopTab.Navigator>
    </SafeAreaView>
  )
}

export default FollowersScreen

const styles = StyleSheet.create({})