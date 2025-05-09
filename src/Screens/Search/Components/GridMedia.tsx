import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Video from 'react-native-video';
import { useTheme } from '../../../util/ThemeContext';
import { SearchStyles } from '../../../StyleSheet/SearchStyles';

const GridMedia = (props : any) => {
    const {
        images,
        item,
        index,
        currentVisibleIndex,
        isFocused,
        func,
    } = props;

    const theme = useTheme();
    const styles = SearchStyles(theme.theme);

    const bigImage = images[index * 5];
    const smallImage1 = images[index * 5 + 1];
    const smallImage2 = images[index * 5 + 2];
    const smallImage3 = images[index * 5 + 3];
    const smallImage4 = images[index * 5 + 4];

    if (!bigImage) return null;

    const isReversed = index % 2 === 0;
    const isPlaying = currentVisibleIndex === index;

    return (
      <View
        style={{
          flexDirection: isReversed ? 'row' : 'row-reverse',
          gap: 2,
          marginBottom: 2,
        }}>
        {bigImage && (
          <TouchableOpacity style={{flex: 1}}>
            <Video
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/project-no1-daseinzumtode.appspot.com/o/video-phuc%2FDownload.mp4?alt=media&token=77311316-23f5-43da-bf98-ad67aec92965',
              }}
              style={styles.bigImage}
              resizeMode="cover"
              repeat
              muted={true}
              paused={isFocused || !isPlaying}
            />
          </TouchableOpacity>
        )}
        <View style={styles.smallImages}>
          {smallImage1 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage1.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
          {smallImage2 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage2.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
          {smallImage3 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage3.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
          {smallImage4 && (
            <TouchableOpacity>
              <Image
                source={{uri: smallImage4.uri}}
                style={styles.smallImage}
              />
              <Image
                source={require('../../../../assets/icon/gallery.png')}
                style={styles.iconDif}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
}

export default GridMedia

const styles = StyleSheet.create({})