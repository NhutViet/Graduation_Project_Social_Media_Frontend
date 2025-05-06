import {Dimensions} from 'react-native';
import {Colors} from '../../assets/color/Colors';

const {width, height} = Dimensions.get('window');

export default {
  colors: Colors,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    fontSizes: {
      xs: 10,
      s: 12,
      m: 14,
      l: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  dimensions: {
    width,
    height,
  },
};
