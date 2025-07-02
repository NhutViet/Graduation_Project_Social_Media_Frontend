import {Colors} from '@assets/color/Colors';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../../src/util/ThemeContext';

const AccountCenterComponent = (props: any) => {
  const {imageAccount, nameAccount} = props;
  const {theme} = useTheme();
  const color = Colors[theme];

  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{uri: imageAccount}} style={styles.image} />
      <View style={styles.body}>
        <Text style={[styles.name, {color: color.text}]}>{nameAccount}</Text>
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
