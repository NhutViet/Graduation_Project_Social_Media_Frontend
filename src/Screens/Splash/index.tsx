import {Image, SafeAreaView, Text, View} from 'react-native';

export const Splash = () => {
  return (
    <SafeAreaView>
      <Image source={require('../../../assets/icon/logo.png')} />
    </SafeAreaView>
  );
};
