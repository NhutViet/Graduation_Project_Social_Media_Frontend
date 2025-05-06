const CommonColors = {
  primary: '#0095F6',
  secondary: '#E1306C',
  textSecondary: '#8E8E8E',
  border: '#DBDBDB',
  error: '#ED4956',
  success: '#2ECC71',
  notification: '#FF3250',
  lightGray: '#FAFAFA',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  blue: '#0095F6',
  orange: '#FFC107',
};

const LightTheme = {
  ...CommonColors,
  background: '#FFFFFF',
  text: '#000000',
  gray: '#f2f2f2',
  lightDark: '#26262666',
  card: '#E5E5E5',
};

const DarkTheme = {
  ...CommonColors,
  background: '#000000',
  text: '#FFFFFF',
  gray: '#262626',
  lightDark: '#26262666',
  card: '#1A1A1A',
};

export const Colors = {
  light: LightTheme,
  dark: DarkTheme,
  ...CommonColors,
};
