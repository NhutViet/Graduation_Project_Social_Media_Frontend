import React, {useEffect, useState} from 'react';
import {View, Text, Image, Platform, ActivityIndicator} from 'react-native';
import {useBookmarkStyles} from '../../../StyleSheet/BookmarkedStyles';
import {Colors} from '../../../../assets/color/Colors';
import {Plus} from 'lucide-react-native';
import {createThumbnail} from 'react-native-create-thumbnail';

interface Props {
  title: string;
  thumbnails: string[]; // video URLs
  coverImg: string; // fallback image
}

const BookmarkedPlaylist: React.FC<Props> = ({title, thumbnails, coverImg}) => {
  const styles = useBookmarkStyles();
  const [thumbUris, setThumbUris] = useState<string[] | null>(null);

  useEffect(() => {
    const videoUris = thumbnails.filter(u => !!u).slice(0, 4);

    Promise.all(
      videoUris.map(uri =>
        createThumbnail({url: uri, timeStamp: 2000})
          .then(res => {
            const path = res.path;
            if (!path) return null;
            // Android cần file:// prefix
            return Platform.OS === 'android' && !path.startsWith('file://')
              ? `file://${path}`
              : path;
          })
          .catch(() => null),
      ),
    ).then(results => {
      const valid = results.filter((p): p is string => !!p);
      setThumbUris(valid);
    });
  }, [thumbnails]);

  if (thumbUris === null) {
    return;
  }

  // Nếu có thumbnail valid thì dùng, không thì coverImg
  const images = thumbUris.length > 0 ? thumbUris : [coverImg];

  const renderGrid = () => {
    const count = images.length;

    if (count === 1) {
      return images[0] === coverImg ? (
        <View
          style={[
            styles.fullImage,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Plus size={50} color={Colors.textSecondary} />
        </View>
      ) : (
        <Image
          source={{uri: images[0]}}
          style={styles.fullImage}
          resizeMode="cover"
        />
      );
    }

    if (count === 2) {
      return (
        <View style={styles.row}>
          {images.map((uri, i) => (
            <Image
              key={i}
              source={{uri}}
              style={styles.halfImage}
              resizeMode="cover"
            />
          ))}
        </View>
      );
    }

    if (count === 3) {
      return (
        <View style={styles.grid3Container}>
          <View style={styles.grid3Row}>
            <Image
              source={{uri: images[0]}}
              style={styles.grid3TopImage}
              resizeMode="cover"
            />
            <Image
              source={{uri: images[1]}}
              style={styles.grid3TopImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.grid3BottomWrapper}>
            <Image
              source={{uri: images[2]}}
              style={styles.grid3BottomImage}
              resizeMode="cover"
            />
          </View>
        </View>
      );
    }

    // 4+ ảnh
    return (
      <View style={styles.gridContainer}>
        {images.map((uri, i) => (
          <Image
            key={i}
            source={{uri}}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.playlistContainer}>
      {renderGrid()}
      <Text style={styles.playlistTitle}>{title}</Text>
    </View>
  );
};

export default BookmarkedPlaylist;
