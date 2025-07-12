import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {ItemHomeStyles} from '../component_styles/ItemHomeStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';
import {User as Mine} from '@services/userRedux/userTypes';
import {User} from '../types';
import {MoreVertical} from 'lucide-react-native';

interface ItemHomeHeaderProps {
  user: User;
  textColor: string;
  borderColor: string;
  iconTintColor: string;
  follow: boolean;
  onUserPress: () => void;
  onFollowPress: (mine: Mine) => void;
  onOptionsPress: () => void;
}

export const ItemHomeHeader: React.FC<ItemHomeHeaderProps> = ({
  user,
  textColor,
  borderColor,
  iconTintColor,
  follow,
  onUserPress,
  onFollowPress,
  onOptionsPress,
}) => {
  const userId = useSelector((state: RootState) => state.user?.user?._id);
  const mine = useSelector((state: RootState) => state.user?.user);

  return (
    <View style={ItemHomeStyles.headerItem}>
      <View style={ItemHomeStyles.rowContainer}>
        <TouchableOpacity style={ItemHomeStyles.blockImg} onPress={onUserPress}>
          <Image
            style={ItemHomeStyles.imgUser}
            source={{uri: user.profilePic}}
          />
        </TouchableOpacity>
        <View>
          <Text style={[ItemHomeStyles.textNormal, {color: textColor}]}>
            {user.handleName}
          </Text>
          <Text style={[ItemHomeStyles.text, {color: textColor}]}>
            Gợi ý cho bạn
          </Text>
        </View>
      </View>

      <View style={ItemHomeStyles.rowContainer}>
        {user._id !== userId && mine && (
          <TouchableOpacity
            style={[ItemHomeStyles.btnFollow, {borderColor}]}
            onPress={() => onFollowPress(mine)}>
            <Text style={[ItemHomeStyles.textNormal, {color: textColor}]}>
              {follow ? 'Đã theo dõi' : 'Theo dõi'}
            </Text>
          </TouchableOpacity>
        )}
        {user._id !== userId && 
          <TouchableOpacity
            onPress={onOptionsPress}
            style={ItemHomeStyles.iconBlock}>
            <MoreVertical size={22} color={iconTintColor} />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};
