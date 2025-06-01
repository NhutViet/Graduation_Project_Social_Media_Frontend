import {
    Image,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    Modal
  } from 'react-native';
  import LinearGradient from 'react-native-linear-gradient';
  import LoginStyles from '../../StyleSheet/LoginStyles';
  import {useState, useEffect} from 'react';
  import SwitchAccountStyles from '../../StyleSheet/SwitchAccountStyles';
  import {Colors} from '../../../assets/color/Colors';
  import {useTheme} from '../../util/ThemeContext';
  import { useDispatch, useSelector } from 'react-redux';
  import { fetchRegister } from '../../../services/userRedux/userSlice';
  import { AppDispatch, RootState } from '../../../services/store';
  import { resetStatus } from '../../../services/userRedux/userReducer';

export const Register = ({navigation}: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [showModal, setShowModal] = useState(false);

    const {theme} = useTheme();
    const styles = LoginStyles();
    const SwitchStyles = SwitchAccountStyles(theme);

    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, isSuccess, isError, errorMessage } = useSelector(
        (state: RootState) => state.user
    );

    const handleRegister = async () => {
        if (!email || !password || !username || !phone) {
        Alert.alert('Error', 'All fields are required!');
        return;
        }

        await dispatch(fetchRegister({ email, password }));
    };

    useEffect(() => {
    if (isSuccess || isError) {
        setShowModal(true);
        const time = setTimeout(() => {
            setShowModal(false);
            dispatch(resetStatus());

            if (isSuccess) {
                navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
            }
        }, 2000);
        return () => clearTimeout(time);
    }
    }, [isError, isSuccess]);

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
            style={RegisterStyle.logo}
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
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
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
            <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                placeholderTextColor={Colors.light.lightDark}
                style={SwitchStyles.input}
            />
            <TouchableOpacity
                style={styles.buttonLogin}
                onPress={handleRegister}>
                <Text style={styles.textBtn}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={SwitchStyles.textFb}>
                <Image source={require('../../../assets/icon/fb.png')} /> Sign up
                with Facebook
                </Text>
            </TouchableOpacity>
            <Image
                style={{width: '100%'}}
                source={require('../../../assets/icon/seperator_or.png')}
            />
            <TouchableOpacity>
                <Text style={SwitchStyles.textGoogle}>
                <Image source={require('../../../assets/icon/gg.png')} /> Sign up
                with Google
                </Text>
            </TouchableOpacity>
            </View>
            <View style={styles.textRow}>
            <Text style={styles.textGray}>Already have an account?</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate("SwitchAccount")}>
                <Text style={styles.text}> Sign in</Text>
            </TouchableOpacity>
            </View>
        </View>
        <Modal visible={showModal} transparent animationType='fade'>
            <View style={styles.modal}>
                <View style={styles.modalContainer}>
                    <Text style={styles.textNoti}>Notification</Text>
                    {isSuccess && <Text style={styles.textContent}>Account created successfully!</Text>}
                    {isError && <Text style={styles.textContent}>{errorMessage}</Text>}
                </View>
            </View>
        </Modal>
        </SafeAreaView>
    );
}

const RegisterStyle = StyleSheet.create({
    logo:{
        width: 150,
        height: 150,
    }
})