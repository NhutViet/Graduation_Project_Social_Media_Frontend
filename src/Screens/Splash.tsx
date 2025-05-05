import {Image, SafeAreaView, Text, View} from 'react-native';

const Splash = () => {
  return (
    <SafeAreaView>
      <Image source={require('../../assets/icon/logo.png')} />
    </SafeAreaView>
  );
};

export default Splash;
