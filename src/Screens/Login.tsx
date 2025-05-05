import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginStyles from '../StyleSheet/LoginStyles';

const Login = ({navigation}: any) => {
  const styles = LoginStyles();

  return (
    <SafeAreaView style={styles.page}>
      <LinearGradient
        colors={['#FEB70B', '#C83753', '#A52AA3', '#0064E0', '#0064E0']}
        locations={[0, 0.24, 0.43, 0.65, 1]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.linear}></LinearGradient>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../assets/icon/logo.png')}
        />
        <View style={styles.blockCenter}>
          <View style={styles.imageUserBlock}>
            <Image
              style={styles.imageUser}
              source={{
                uri: 'https://i.pinimg.com/736x/f7/a3/5f/f7a35fc85b99b7776bc07e0ef7f27441.jpg',
              }}
            />
          </View>
          <Text style={styles.text}>Justina Xie</Text>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => {
              navigation.navigate('BottomTabs');
            }}>
            <Text style={styles.textBtn}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SwitchAccount')}>
            <Text style={styles.textSwitchAccount}>Switch accounts</Text>
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

export default Login;
