import {useNavigation} from '@react-navigation/native';
import {Image, Linking, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../services/store';
import {useEffect} from 'react';
import {fetchCheckRefreshToken} from '../../../services/userRedux/userSlice';

export const Splash = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const url = await Linking.getInitialURL();
        let path = '';

        if (url) {
          const stripped = url
            .replace('cirla://', '')
            .replace('https://cirla.io.vn/', '');
          path = stripped;
        }

        await dispatch(fetchCheckRefreshToken()).unwrap();

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'BottomTabs',
              params: path ? {path} : undefined,
            },
          ],
        });
      } catch {
        navigation.reset({index: 0, routes: [{name: 'SwitchAccount'}]});
      }
    };

    checkLogin();
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
