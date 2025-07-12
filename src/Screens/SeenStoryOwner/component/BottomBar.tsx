import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {styles} from './style';
import {UserMini} from '@services/StoryRedux/StoryType';
import {Users, MoreHorizontal} from 'lucide-react-native';

interface Props {
  onShowPeopleSeen: () => void;
  onShowMore: () => void;
  visible: boolean;
  users: UserMini[];
  onDelete: () => void;
  onClose: () => void;
}

const SeenStoryOwnerBottom: React.FC<Props> = ({
  onShowPeopleSeen,
  onShowMore,
}) => {
  return (
    <View style={styles.viewBottom}>
      <TouchableOpacity style={styles.viewIconItem} onPress={onShowPeopleSeen}>
        <Users size={22} color={'black'} />
        <Text style={styles.txtIcon}>Hoạt động</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewIconItem} onPress={onShowMore}>
        <MoreHorizontal size={22} color={'black'} />
        <Text style={styles.txtIcon}>Xem thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SeenStoryOwnerBottom;
