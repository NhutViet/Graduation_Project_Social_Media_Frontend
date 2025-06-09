import React from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Video as Icon, Tag} from 'lucide-react-native';
import {Styles} from '../../../StyleSheet/Profile.Styles';
import Video from 'react-native-video';
import {Colors} from '../../../../assets/color/Colors';
import { useNavigation } from '@react-navigation/native';

interface GridViewProps {
  data: any[];
  renderOverlay?: () => React.ReactNode;
}

const GridView: React.FC<GridViewProps> = ({data, renderOverlay}) => {
  const navigate = useNavigation<any>();
  return (
    <>
      {data.length > 0 ? (
        <FlashList
          data={data}
          numColumns={3}
          estimatedItemSize={Styles.itemSize}
          scrollEnabled={true}
          extraData={data}
          renderItem={({item}) => {
            const media = item.media?.[0];

            let uri = null;
            let isVideo = false;
            if (media?.videoUrl) {
              uri = media.videoUrl;
              isVideo = true;
            } else if (media?.imageUrl) {
              uri = media.imageUrl;
              isVideo = false;
            }
            return (
              <TouchableOpacity style={Styles.styles.gridItem} >
                {isVideo ? (
                  <Video
                    source={{uri: uri}}
                    style={[
                      Styles.styles.gridImage,
                      {
                        width: Styles.itemSize - 2,
                        height: Styles.itemSize - 2,
                        backgroundColor: Colors.black,
                      },
                    ]}
                    paused={true}
                  />
                ) : (
                  <Image
                    source={{uri: uri}}
                    style={[
                      Styles.styles.gridImage,
                      {width: Styles.itemSize - 2, height: Styles.itemSize - 2},
                    ]}
                  />
                )}
                {renderOverlay && renderOverlay()}
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[Styles.styles.centerItem]}>
          <Image
            source={require('../../../../assets/icon/no_photo.png')}
            style={Styles.styles.imgNoPhoto}
          />
          <Text style={Styles.styles.textno}>Bạn chưa đăng nội dung nào.</Text>
        </View>
      )}
    </>
  );
};

export const PostsView: React.FC<{data: any[]}> = ({data}) => {
  return <GridView data={data} />;
};

export const ReelsView: React.FC<{data: any[]}> = ({data}) => {
  return (
    <GridView
      data={data}
      renderOverlay={() => (
        <View style={Styles.styles.reelOverlay}>
          <Icon color="white" size={20} />
        </View>
      )}
    />
  );
};

export const TaggedView: React.FC<{data: any[]}> = ({data}) => {
  return (
    <GridView
      data={data}
      renderOverlay={() => (
        <View style={Styles.styles.tagOverlay}>
          <Tag color="white" size={20} />
        </View>
      )}
    />
  );
};
