import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors} from '../../assets/color/Colors';
import {useTheme} from '../util/ThemeContext';

const Home = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <Text style={{color: color.text}}>Hello World!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 93,
    height: 93,
  },
});
export default Home;
