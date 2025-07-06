import React from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Styles} from '../../../StyleSheet/Profile.Styles';
import {Colors} from '../../../../assets/color/Colors';

interface GridViewProps {
  data: any[];
  onPressItem?: (item: any) => void;
}

const convertToImage = (uri: string): string => {
  if (
    uri.includes('videodelivery.net') &&
    uri.includes('/manifest/') &&
    !uri.endsWith('.jpg')
  ) {
    const parts = uri.split('/');
    const videoId = parts[3];
    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=2s`;
  }
  return uri;
};

export const GridView: React.FC<GridViewProps> = ({data, onPressItem}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[Styles.styles.centerItem, {flex: 1}]}>
        <Image
          source={require('../../../../assets/icon/no_photo.png')}
          style={Styles.styles.imgNoPhoto}
        />
        <Text style={Styles.styles.textno}>Chưa đăng nội dung nào.</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlashList
        data={data}
        numColumns={3}
        estimatedItemSize={Styles.itemSize}
        extraData={data}
        keyExtractor={item => item._id?.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={React.useCallback(
          ({item}: {item: any}) => {
            const media = item.media?.[0];
            let uri: string | null = null;

            if (media?.videoUrl) {
              uri = convertToImage(media.videoUrl);
            } else if (media?.imageUrl) {
              uri = media.imageUrl;
            }

            return (
              <View style={Styles.styles.gridItem}>
                <TouchableOpacity onPress={() => onPressItem?.(item)}>
                  {uri ? (
                    <Image
                      source={{uri}}
                      style={[
                        Styles.styles.gridImage,
                        {
                          width: Styles.itemSize - 2,
                          height: Styles.itemSize - 2,
                          backgroundColor: Colors.black,
                        },
                      ]}
                    />
                  ) : (
                    <View
                      style={[
                        Styles.styles.gridImage,
                        {
                          width: Styles.itemSize - 2,
                          height: Styles.itemSize - 2,
                          backgroundColor: Colors.gray21,
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              </View>
            );
          },
          [onPressItem],
        )}
      />
    </View>
  );
};
