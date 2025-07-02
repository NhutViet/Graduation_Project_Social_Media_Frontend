import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../../components/Header';

interface HelpOption {
  id: string;
  title: string;
  onPress: () => void;
}

export const HelpCenter = () => {
    const {theme} = useTheme();
    const color = Colors[theme];
    const navigation = useNavigation();
    const goBack = useCallback((): void => {
        navigation.goBack();
      }, [navigation]);
    

    const options: HelpOption[] = [
    {
      id: 'faq',
      title: 'FAQ',
      onPress: () => null,
    },
    {
      id: 'contact',
      title: 'Liên hệ',
      onPress: () => null,
    },
    {
      id: 'report',
      title: 'Báo lỗi',
      onPress: () => null,
    },
    {
      id: 'support',
      title: 'Hỗ trợ',
      onPress: () => null,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    list: {
      marginTop: Colors.spacing.s,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Colors.spacing.m,
      paddingHorizontal: Colors.spacing.m,
    },
    itemText: {
      flex: 1,
      fontSize: Colors.typography.fontSizes.m,
      color: color.text,
    },
    arrowIcon: {
      width: 15,
      height: 15,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '100%', height: 60}}>
        <Header
          pressableTitle="Trung tâm trợ giúp"
          iconBack={require('../../../../assets/icon/left.png')}
          func={goBack}
          navigation={navigation}
        />
      </View>
      <View style={styles.list}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.item}
            onPress={option.onPress}
          >
            <Text style={styles.itemText}>{option.title}</Text>
            <Image
              source={require('../../../../assets/icon/right.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}
