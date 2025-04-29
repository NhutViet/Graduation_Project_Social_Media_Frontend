import {StyleSheet} from 'react-native';
import Colors from '../../assets/color/Colors';

const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 75,
    height: 75,
  },
});

export default AppStyles;
