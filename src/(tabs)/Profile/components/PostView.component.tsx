import React from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Video, Tag} from 'lucide-react-native';
import {Styles} from '../../../StyleSheet/Profile.Styles';

interface GridViewProps {
  data: any[];
  renderOverlay?: () => React.ReactNode;
}

const GridView: React.FC<GridViewProps> = ({data, renderOverlay}) => {
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
            const media = item.media[0];
            const isReel = item.type === 'reel';
            const uri = isReel ? media.videoUrl : media.imageUrl;
            return (
              <TouchableOpacity style={Styles.styles.gridItem}>
                <Image
                  source={{uri: item.media[0].imageUrl}}
                  style={[
                    Styles.styles.gridImage,
                    {width: Styles.itemSize - 2, height: Styles.itemSize - 2},
                  ]}
                />
                {renderOverlay && renderOverlay()}
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[Styles.styles.centerItem]}>
          <Image source={require('../../../../assets/icon/no_photo.png')} style={Styles.styles.imgNoPhoto}/>
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
          <Video color="white" size={20} />
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
