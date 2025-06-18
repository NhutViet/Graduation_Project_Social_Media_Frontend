import React from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Styles} from '../../../StyleSheet/Profile.Styles';
import Video from 'react-native-video';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {fetchReels} from '@services/reelRedux/reelReducer';
import {Reel} from '@services/reelRedux/reelTypes';

interface GridViewProps {
  data: any[];
  renderOverlay?: () => React.ReactNode;
}

const GridView: React.FC<GridViewProps> = ({data, renderOverlay}) => {
  const dispatch = useDispatch();
  const navigate = useNavigation<any>();
  const reelsArray: Reel[] = [];
  const handlePostPress = (postId: string) => {
    navigate.navigate('ViewReels', {postId});
    dispatch(fetchReels(reelsArray));
  };
  return (
    <>
      {data.length > 0 ? (
        <FlashList
          data={data}
          // numColumns={3}
          estimatedItemSize={Styles.itemSize}
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
              <View style={Styles.styles.gridItem}>
                {isVideo ? (
                  <TouchableOpacity onPress={() => handlePostPress(item._id)}>
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
                  </TouchableOpacity>
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
              </View>
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
