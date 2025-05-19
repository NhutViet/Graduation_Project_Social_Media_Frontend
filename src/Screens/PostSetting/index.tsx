import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../util/ThemeContext';
import {getAddPostStyles} from '../../StyleSheet/AddPostStyles';
import {FlashList} from '@shopify/flash-list';
import {Colors} from '../../../assets/color/Colors';
import Section from '../../../components/Section';
import {useNavigation, useRoute} from '@react-navigation/native';

const images = [
  {
    id: 1,
    uri: 'https://th.bing.com/th/id/OIP.o_9EAUaBqVwRENd5iU7-xgAAAA?w=284&h=188&c=7&r=0&o=5&cb=iwc1&dpr=2&pid=1.7',
  },
  {
    id: 2,
    uri: 'https://th.bing.com/th/id/OIP.o_9EAUaBqVwRENd5iU7-xgAAAA?w=284&h=188&c=7&r=0&o=5&cb=iwc1&dpr=2&pid=1.7',
  },
  {
    id: 3,
    uri: 'https://th.bing.com/th/id/OIP.o_9EAUaBqVwRENd5iU7-xgAAAA?w=284&h=188&c=7&r=0&o=5&cb=iwc1&dpr=2&pid=1.7',
  },
  {
    id: 4,
    uri: 'https://th.bing.com/th/id/OIP.o_9EAUaBqVwRENd5iU7-xgAAAA?w=284&h=188&c=7&r=0&o=5&cb=iwc1&dpr=2&pid=1.7',
  },
];

export const PostSetting = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {width} = Dimensions.get('window');
  const styles = getAddPostStyles(theme);
  const navigation = useNavigation();

  //lâys dữ liệu
  const route = useRoute();
  const {selectedMedia}: any = route.params || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowSpace}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/left.png')}
            style={styles.iconR}
          />
        </TouchableOpacity>
        <Text style={styles.title}>New Campain</Text>
        <View style={styles.iconR}></View>
      </View>
      <ScrollView style={styles.container}>
        <View
          style={[
            {
              backgroundColor: color.transparent,
              justifyContent: 'center',
              marginLeft: 20,
            },
          ]}>
          {selectedMedia && selectedMedia.length > 0 && (
            <FlashList
              data={selectedMedia}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}: any) => (
                <Image
                  source={{uri: item.node.image.uri}}
                  style={[styles.imgShow]}
                />
              )}
              estimatedItemSize={200}
            />
          )}
        </View>
        <TextInput
          placeholder="Thêm chú thích"
          placeholderTextColor={color.lightDark}
          style={styles.textIn}
          multiline={true}
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.btnTD}>
          <Image source={require('../../../assets/icon/Menu.png')} style={styles.icon}/>
          <Text style={[styles.textR, {fontWeight: 'normal'}]}>Thăm dò ý kiến</Text>
        </TouchableOpacity>
        <Section
          title={'Gắn thẻ người khác'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/tagSO.png')}
        />
        <Section
          title={'Thêm vị trí'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/location.png')}
        />
        <Section
          title={'Thêm nhạc'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/music.png')}
        />
        <Section
          title={'Đối tượng'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/eye.png')}
        />
        <View style={styles.divi}></View>
        <Section
          title={'Lựa chọn khác'}
          iconRight={require('../../../assets/icon/right.png')}
          iconLeft={require('../../../assets/icon/threedot.png')}
        />
      </ScrollView>
      <TouchableOpacity style={styles.btnShare}>
        <Text style={styles.textBtn}>Share</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
