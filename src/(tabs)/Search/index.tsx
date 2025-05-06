import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';

const Search = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <Text style={{color: color.text}}>Search Screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Search;
