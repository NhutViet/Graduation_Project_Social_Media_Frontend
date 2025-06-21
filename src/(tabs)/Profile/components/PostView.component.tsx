import React from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Styles} from '../../../StyleSheet/Profile.Styles';
import Video from 'react-native-video';
import {Colors} from '../../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';

interface GridViewProps {
  data: any[];
  onPressItem?: (item: any) => void;
}

const GridView: React.FC<GridViewProps> = ({data, onPressItem}) => {

  return (
    <>
      {data.length > 0 ? (
        <FlashList
          data={data}
          numColumns={3}
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
                  <TouchableOpacity onPress={onPressItem}>
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
                <TouchableOpacity onPress={onPressItem}>
                  <Image
                    source={{uri: uri}}
                    style={[
                      Styles.styles.gridImage,
                      {width: Styles.itemSize - 2, height: Styles.itemSize - 2},
                    ]}
                  />
                </TouchableOpacity>
                )}
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
  const navigation = useNavigation<any>();
  const handlePress = (item: any) => {
    navigation.navigate('AllPostOfUserScreen', {
      targetPostId: item._id,
    });
  };
  return <GridView data={data} onPressItem={handlePress} />;
};

export const ReelsView: React.FC<{data: any[]}> = ({data}) => {
  const navigation = useNavigation<any>();
  const handlePress = () => {
    navigation.navigate('ViewReels', {
    });
  };
  return <GridView data={data} onPressItem={handlePress} />;
};

export const TagsView: React.FC<{data: any[]}> = ({data}) => {
  const navigation = useNavigation<any>();
  const handlePress = (item: any) => {
    navigation.navigate('AllPostOfUserScreen', {
      targetPostId: item._id,
    });
  };
  return <GridView data={data} onPressItem={handlePress} />;
};
