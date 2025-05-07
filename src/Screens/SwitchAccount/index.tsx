import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginStyles from '../../StyleSheet/LoginStyles';
import {useState} from 'react';
import SwitchAccountStyles from '../../StyleSheet/SwitchAccountStyles';
import {Colors} from '../../../assets/color/Colors';
import {useTheme} from '../../util/ThemeContext';

export const SwitchAccount = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {theme} = useTheme();
  const styles = LoginStyles();
  const SwitchStyles = SwitchAccountStyles(theme);

  return (
    <SafeAreaView style={styles.page}>
      <LinearGradient
        colors={['#FEB70B', '#C83753', '#A52AA3', '#0064E0', '#0064E0']}
        locations={[0, 0.24, 0.43, 0.65, 1]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linear}></LinearGradient>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={SwitchStyles.iconBack}
          source={require('../../../assets/icon/left.png')}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../../assets/icon/logo.png')}
        />
        <View style={SwitchStyles.body}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={Colors.light.lightDark}
            style={SwitchStyles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor={Colors.light.lightDark}
            style={SwitchStyles.input}
          />
          <TouchableOpacity>
            <Text style={SwitchStyles.textForgot}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => navigation.navigate('BottomTabs')}>
            <Text style={styles.textBtn}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width: '100%'}}>
            <Text style={SwitchStyles.textFb}>
              <Image source={require('../../../assets/icon/fb.png')} /> Log in
              with Facebook
            </Text>
          </TouchableOpacity>
          <Image
            style={{width: '100%'}}
            source={require('../../../assets/icon/seperator_or.png')}
          />
          <TouchableOpacity style={{width: '100%'}}>
            <Text style={SwitchStyles.textGoogle}>
              <Image source={require('../../../assets/icon/gg.png')} /> Log in
              with Google
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textGray}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.text}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
