import {Colors} from '@assets/color/Colors';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../../src/util/ThemeContext';
import {useNavigation} from '@react-navigation/native';

const AccountCenterComponent = (props: any) => {
  const {user} = props;
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('InfoAccountCenter', {user});
      }}>
      <Image source={{uri: user?.profilePic}} style={styles.image} />
      <View style={styles.body}>
        <Text style={[styles.name, {color: color.text}]}>{user?.username}</Text>
        <Text style={[styles.text, {color: color.text}]}>Cirla</Text>
      </View>
      <Image
        style={styles.icon}
        source={require('../../../../assets/icon/right.png')}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    paddingLeft: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
});

export default AccountCenterComponent;
