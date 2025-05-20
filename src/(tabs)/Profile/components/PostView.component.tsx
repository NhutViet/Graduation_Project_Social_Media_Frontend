import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Video, Tag} from 'lucide-react-native';
import {Styles} from '../../../StyleSheet/Profile.Styles';

interface GridViewProps {
  data: any[];
  renderOverlay?: () => React.ReactNode;
}

const GridView: React.FC<GridViewProps> = ({data, renderOverlay}) => {
  return (
    <FlashList
      data={data}
      numColumns={3}
      estimatedItemSize={Styles.itemSize}
      scrollEnabled={true}
      extraData={data}
      renderItem={({item}) => (
        <TouchableOpacity style={Styles.styles.gridItem}>
          <Image
            source={{uri: item.image}}
            style={[
              Styles.styles.gridImage,
              {width: Styles.itemSize - 2, height: Styles.itemSize - 2},
            ]}
          />
          {renderOverlay && renderOverlay()}
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
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
