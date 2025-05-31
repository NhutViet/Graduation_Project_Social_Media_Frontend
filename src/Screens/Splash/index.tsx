import {useNavigation} from '@react-navigation/native';
import {Image, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {useEffect} from 'react';
import {fetchCheckRefreshToken} from '../../../services/userRedux/userSlice';

export const Splash = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    dispatch(fetchCheckRefreshToken())
      .unwrap()
      .then(() => {
        if (user) {
          navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
        } else {
          navigation.reset({index: 0, routes: [{name: 'SwitchAccount'}]});
        }
      })
      .catch(() => {
        navigation.reset({index: 0, routes: [{name: 'SwitchAccount'}]});
      });
  }, []);

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
