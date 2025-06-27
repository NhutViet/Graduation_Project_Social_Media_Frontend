import { Image, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../../assets/color/Colors';
import {useTheme} from '../../../../util/ThemeContext';
import { History } from 'lucide-react-native';

const HighlightsTab = () => {
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>
      <View style={{height: '90%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 65, backgroundColor: color.background}}>
        <View style={{width: 100, height: 100, borderWidth: 1, borderRadius: 80, borderColor: color.text, justifyContent: 'center', alignItems: 'center'}}>
          <History size={70} color={color.text}/>
        </View>
          <Text style={{fontSize: 19, fontWeight: 'bold', color: color.text, marginVertical: 10}}>Chưa lưu trữ tin nổi bật nào</Text>
          <Text style={{fontSize: 15, color: color.secondary, textAlign:"center"}}>Tin nổi bật mà bạn lưu trữ sẽ hiển thị ở đây. Chỉ bạn mới xem được các tin này.</Text>
      </View>
    </SafeAreaView>
  )
}

export default HighlightsTab

const styles = StyleSheet.create({})