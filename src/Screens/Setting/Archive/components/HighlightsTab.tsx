import { Image, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';

const HighlightsTab = () => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{height: '90%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 65, backgroundColor: color.background}}>
        <View style={{width: 100, height: 100, borderWidth: 1, borderRadius: 80, borderColor: color.text, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 70, height: 70, resizeMode: 'contain', tintColor: color.text}} source={require('../../../../../assets/icon/archiveStory.png')}/>
        </View>
          <Text style={{fontSize: 19, fontWeight: 'bold', color: color.text, marginVertical: 10}}>No archived highlights</Text>
          <Text style={{fontSize: 15, color: color.secondary, textAlign:"center"}}>When you archive highlights, they'll show up here. Only you can see them.</Text>
      </View>
    </SafeAreaView>
  )
}

export default HighlightsTab

const styles = StyleSheet.create({})