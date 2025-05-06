import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
const Post = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: color.background}]}>
      <Text>Post Screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Post;
