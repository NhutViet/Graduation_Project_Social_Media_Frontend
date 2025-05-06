import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';
const Notification = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  return (
    <View style={[styles.container, {backgroundColor: color.background}]}>
      <Text>Notification</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Notification;
