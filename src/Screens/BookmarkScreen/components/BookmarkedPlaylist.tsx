import React from 'react';
import { View, Text, Image } from 'react-native';
import { useBookmarkStyles } from '../../../StyleSheet/BookmarkedStyles';

// Ảnh mặc định nếu không có thumbnail hợp lệ

interface Props {
  title: string;
  thumbnails: string[];
  coverImg: string;
}

// Hàm chuyển m3u8 thành ảnh thumbnail nếu là Cloudflare Stream
const convertToImage = (uri: string): string => {
  if (
    uri.includes('videodelivery.net') &&
    uri.includes('/manifest/') &&
    !uri.endsWith('.jpg') // tránh convert ảnh đã hợp lệ
  ) {
    const parts = uri.split('/');
    const videoId = parts[3]; // lấy videoId từ đường dẫn
    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=2s`;
  }
  return uri;
};

const BookmarkedPlaylist: React.FC<Props> = ({ title, thumbnails, coverImg }) => {
  const styles = useBookmarkStyles();

  // Chuyển đổi m3u8 thành ảnh và lọc ảnh hợp lệ
  const validThumbs = thumbnails
    .map(convertToImage)
    .filter(uri => uri && uri.trim());

  // Nếu không có ảnh => dùng placeholder
  const imagesToShow = validThumbs.length > 0 ? validThumbs.slice(0, 4) : [coverImg];

  const renderGrid = () => {
    const count = imagesToShow.length;

    if (count === 1) {
      return <Image source={{ uri: imagesToShow[0] }} style={styles.fullImage} resizeMode="cover" />;
    }

    if (count === 2) {
      return (
        <View style={styles.row}>
          {imagesToShow.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.halfImage} resizeMode="cover" />
          ))}
        </View>
      );
    }

    if (count === 3) {
      return (
        <View style={styles.grid3Container}>
          <View style={styles.grid3Row}>
            <Image source={{ uri: imagesToShow[0] }} style={styles.grid3TopImage} resizeMode="cover" />
            <Image source={{ uri: imagesToShow[1] }} style={styles.grid3TopImage} resizeMode="cover" />
          </View>
          <View style={styles.grid3BottomWrapper}>
            <Image source={{ uri: imagesToShow[2] }} style={styles.grid3BottomImage} resizeMode="cover" />
          </View>
        </View>
      );
    }

    // 4 ảnh trở lên
    return (
      <View style={styles.gridContainer}>
        {imagesToShow.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.gridImage} resizeMode="cover" />
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
