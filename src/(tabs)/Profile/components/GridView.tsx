import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, View, Image, Text, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Styles } from '../../../StyleSheet/Profile.Styles';
import { Colors } from '../../../../assets/color/Colors';
import { PostWithMedia } from '@services/postRedux/postTypes';
import { ImageOff, Video, Layers } from 'lucide-react-native';
import { createThumbnail } from 'react-native-create-thumbnail';

interface GridViewProps {
  data: PostWithMedia[];
  onPressItem?: (item: PostWithMedia) => void;
}

// Generate thumbnail for video
const generateVideoThumbnail = async (videoUrl: string): Promise<string | null> => {
  try {
    const result = await createThumbnail({
      url: videoUrl,
      timeStamp: 2000, // 2 seconds
    });

    if (!result.path) {
      return null;
    }

    // Android needs file:// prefix
    const finalPath = Platform.OS === 'android' && !result.path.startsWith('file://')
      ? `file://${result.path}`
      : result.path;

    return finalPath;
  } catch (error) {
    return null;
  }
};

// Grid item component
const GridItem: React.FC<{
  item: PostWithMedia;
  onPress?: (item: PostWithMedia) => void;
}> = React.memo(({ item, onPress }) => {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const media = item.media?.[0];
  const isVideo = !!media?.videoUrl;
  const hasMultipleMedia = item.media && item.media.length > 1;

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!media) {
        return;
      }

      if (media.videoUrl) {
        // Validate video URL before processing
        if (!media.videoUrl.trim()) {
          setThumbnailUri(media.imageUrl || null);
          return;
        }

        setIsLoading(true);
        const thumbnail = await generateVideoThumbnail(media.videoUrl);

        // Use thumbnail if available, otherwise fallback to imageUrl
        const finalUri = thumbnail || media.imageUrl || null;
        setThumbnailUri(finalUri);
        setIsLoading(false);
      } else if (media.imageUrl) {
        // Validate image URL before setting
        if (!media.imageUrl.trim()) {
          setThumbnailUri(null);
          return;
        }

        setThumbnailUri(media.imageUrl);
      } else {
        setThumbnailUri(null);
      }
    };
    loadThumbnail();
  }, [media, item._id]);

  return (
    <View style={Styles.styles.gridItem}>
      <TouchableOpacity onPress={() => onPress?.(item)}>
        {thumbnailUri && thumbnailUri.trim() ? (
          <Image
            source={{ uri: thumbnailUri }}
            style={[
              Styles.styles.gridImage,
              {
                width: Styles.itemSize - 2,
                height: Styles.itemSize - 2,
                backgroundColor: Colors.black,
              },
            ]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              Styles.styles.gridImage,
              {
                width: Styles.itemSize - 2,
                height: Styles.itemSize - 2,
                backgroundColor: Colors.gray21,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            {isLoading ? (
              <Text style={{ color: Colors.white, fontSize: 12 }}>...</Text>
            ) : (
              <ImageOff size={24} color={Colors.white} />
            )}
          </View>
        )}

        {/* Overlay icons */}
        {(isVideo || hasMultipleMedia) && (
          <View style={{
            position: 'absolute',
            top: 6,
            right: 6,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 12,
            padding: 4,
          }}>
            {isVideo ? (
              <Video size={16} color="white" />
            ) : (
              <Layers size={16} color="white" />
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

export const GridView: React.FC<GridViewProps> = ({ data, onPressItem }) => {
  // Early return if data is undefined or empty
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <View style={[Styles.styles.centerItem, { flex: 1, marginTop: 60 }]}>
        <ImageOff size={64} color="#ccc" style={{ marginBottom: 16 }} />
        <Text style={Styles.styles.textno}>Không có nội dung nào.</Text>
      </View>
    );
  }

  const renderItem = useCallback(
    ({ item }: { item: PostWithMedia }) => (
      <GridItem item={item} onPress={onPressItem} />
    ),
    [onPressItem]
  );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={data}
        numColumns={3}
        estimatedItemSize={Styles.itemSize}
        extraData={data}
        keyExtractor={(item) => item._id?.toString() || ''}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
};
