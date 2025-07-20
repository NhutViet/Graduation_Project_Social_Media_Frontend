import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../../components/Header';
import {ChevronRight} from 'lucide-react-native';

interface HelpOption {
  id: string;
  title: string;
  onPress: () => void;
}

export const HelpCenter = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();
  const goBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const options: HelpOption[] = [
    {
      id: 'faq',
      title: 'FAQ',
      onPress: () => navigation.navigate('FAQScreen'),
    },
    {
      id: 'contact',
      title: 'Liên hệ',
      onPress: () => navigation.navigate('ContactScreen'),
    },
    {
      id: 'report',
      title: 'Báo lỗi',
      onPress: () => navigation.navigate('ReportProblemScreen'),
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
          iconBack={true}
          func={goBack}
          navigation={navigation}
        />
      </View>
      <View style={styles.list}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.item}
            onPress={option.onPress}>
            <Text style={styles.itemText}>{option.title}</Text>
            <ChevronRight size={22} color={color.text} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};
