import {useNavigation} from '@react-navigation/native';
import {Image, SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../services/store';
import {useEffect} from 'react';

export const Splash = () => {
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    console.log('user: ', user);
    if (user) {
      navigation.navigate('BottomTabs');
    } else {
      navigation.navigate('SwitchAccount');
    }
  }, [user]);

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('../../../assets/icon/logo.png')}
        style={{width: 200, height: 200, resizeMode: 'contain'}}
      />
    </SafeAreaView>
  );
};
