import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const theme = {
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

const CommonColors = {
  primary: '#0095F6',
  secondary: '#E1306C',
  textSecondary: '#8E8E8E',
  border: '#DBDBDB',
  error: '#ED4956',
  success: '#2ECC71',
  notification: '#FF3250',
  lightGray: '#f1f1f1',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  blue: '#0095F6',
  orange: '#FFC107',
  input: '#DDDDDD',
};

const LightTheme = {
  ...CommonColors,
  background: '#FFFFFF',
  text: '#000000',
  modal: '#FFFFFF',
  gray: '#F0F0F0',
  lightDark: '#00000020',
  lessBlack: '#f1f1f1',
  search: '#F8F8FF',
  card: '#F8F8F8',
};

const DarkTheme = {
  ...CommonColors,
  background: '#000000',
  text: '#FFFFFF',
  modal: '#1A1A1A',
  gray: '#1A1A1A',
  lightDark: '#FFFFFF20',
  lessBlack: '#141414',
  search: '#222222',
  card: '#121212',
};

export const Colors = {
  light: LightTheme,
  dark: DarkTheme,
  ...CommonColors,
  ...theme,
};
