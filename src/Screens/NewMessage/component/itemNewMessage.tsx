import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';
import {useTheme} from '../../../util/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import { ChevronRight } from 'lucide-react-native';

interface ItemNewMessageProps {
  roomId: string;
  nameChat: string;
  latestMessage: {
    content: string;
  };
  img1?: string;
  img2?: string;
}

const ItemNewMessage: React.FC<ItemNewMessageProps> = ({
  roomId,
  nameChat,
  latestMessage,
  img1,
  img2,
}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const navigation: any = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('MessageScreen', {
          room: roomId,
        });
      }}>
      <View style={styles.rowContainer}>
        <View
          style={[
            styles.imgContainer,
            {overflow: img1 && !img2 ? 'hidden' : undefined},
          ]}>
          {img2 && (
            <>
              <Image style={styles.iconW} source={{uri: img1}} />
              <Image
                style={[
                  styles.iconF,
                  {
                    borderColor: color.background,
                    backgroundColor: color.backgroundSecondary,
                  },
                ]}
                source={{uri: img2}}
              />
            </>
          )}
          {!img2 && img1 && <Image style={styles.img} source={{uri: img1}} />}
        </View>
        <View>
          <Text style={[styles.nameChat, {color: color.text}]}>{nameChat}</Text>
          <Text style={[styles.textNormal, {color: color.text}]}>
            {latestMessage.content}
          </Text>
        </View>
      </View>
      <View style={styles.blockIcon}>
        <ChevronRight color={color.text}/>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    position: 'relative',
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconW: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
    borderRadius: 25,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  iconF: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
    borderRadius: 25,
    zIndex: 1,
    bottom: 0,
    right: 0,
    borderWidth: 2,
    position: 'absolute',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  icon: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
  },
  nameChat: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textNormal: {
    fontSize: 14,
  },
  blockIcon: {
    width: 20,
    height: 20,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemNewMessage;
