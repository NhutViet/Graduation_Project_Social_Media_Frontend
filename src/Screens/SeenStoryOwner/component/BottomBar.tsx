import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {styles} from './style';

interface Props {
  onShowPeopleSeen: () => void;
  onShowMore: () => void;
  visible: boolean;
  users: any[];
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
        <Image
          style={styles.icon}
          source={require('../../../../assets/icon/users.png')}
        />
        <Text style={styles.txtIcon}>Hoạt động</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewIconItem} onPress={onShowMore}>
        <Image
          style={styles.icon}
          source={require('../../../../assets/icon/ellipsis.png')}
        />
        <Text style={styles.txtIcon}>Xem thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SeenStoryOwnerBottom;
