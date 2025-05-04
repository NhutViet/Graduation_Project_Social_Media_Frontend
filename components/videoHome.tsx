import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';

const VideoHome = (props: any) => {
  const {id, uri, like, comment, share, title, date, currentVisible} = props;
  return (
    <View>
      <View style={styles.container}>
        <Video
          source={{uri: uri}}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={currentVisible !== id}
        />
      </View>
      <View>
        <View>
          <View>
            <Image />
            <Text></Text>
            <Image />
            <Text></Text>
            <Image />
            <Text></Text>
          </View>
          <TouchableOpacity>
            <Image />
          </TouchableOpacity>
        </View>
        <Text>{title}</Text>
        <Text>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  video: {},
});

export default VideoHome;
