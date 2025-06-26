import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import { Heart } from 'lucide-react-native';

const width = Dimensions.get('window').width - 96;

interface CommentComponentProps {
  onReply: (id: string, handleName: string) => void;
  [key: string]: any;
}

const CommentComponent = ({onReply, ...props}: CommentComponentProps) => {
  const {
    _id,
    user,
    postID,
    content,
    mediaUrl,
    isDeleted,
    likedBy,
    createdAt,
    reply,
  } = props;
  const {theme} = useTheme();
  const color = Colors[theme];

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} năm trước`;
    if (months > 0) return `${months} tháng trước`;
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `Vừa xong`;
  };

  const renderItem = ({item}: {item: any}) => {
    const {
      _id,
      user,
      postID,
      content,
      mediaUrl,
      isDeleted,
      likedBy,
      createdAt,
    } = item;
    return (
      <View style={[styles.rowContainer, {marginTop: 10}]}>
        <TouchableOpacity style={styles.blockImgReply}>
          <Image
            style={styles.imgUser}
            source={{
              uri: user?.profilePic,
            }}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.rowContainer,
            {justifyContent: 'space-between', width: width - 46},
          ]}>
          <View style={{width: '80%'}}>
            <View style={[styles.rowContainer, {alignItems: 'center'}]}>
              <Text style={[styles.name, {color: color.text, marginRight: 20}]}>
                {user?.handleName}
              </Text>
              <Text style={[styles.text, {color: color.text}]}>
                {formatTimeAgo(createdAt)}
              </Text>
            </View>
            <View>
              <Text
                style={[styles.content, {color: color.text}]}
                numberOfLines={3}>
                {content}
              </Text>
            </View>
            <View style={[styles.rowContainer, {alignItems: 'center'}]}>
              <TouchableOpacity>
                <Text style={[styles.text, {color: color.text}]}>
                  xem bản dịch
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <TouchableOpacity style={styles.blockIcon}>
              <Heart style={[styles.icon]} color={color.text}/>
            </TouchableOpacity>
            <Text style={[styles.text, {color: color.text}]}>4</Text>
          </View>
        </View>
      </View>
    );
  };

  const [moreComment, setMoreComment] = useState<boolean>(false);

  return (
    <View style={[styles.rowContainer, {marginBottom: 20}]}>
      <TouchableOpacity style={styles.blockImg}>
        <Image
          style={styles.imgUser}
          source={{
            uri: user?.profilePic,
          }}
        />
      </TouchableOpacity>
      <View
        style={[
          styles.rowContainer,
          {justifyContent: 'space-between', width: width},
        ]}>
        <View style={{width: width}}>
          <View style={[styles.rowContainer, {alignItems: 'center'}]}>
            <Text style={[styles.name, {color: color.text, marginRight: 20}]}>
              {user?.handleName}
            </Text>
            <Text style={[styles.text, {color: color.text}]}>
              {formatTimeAgo(createdAt)}
            </Text>
          </View>
          <View style={{width: '80%'}}>
            <Text
              style={[styles.content, {color: color.text}]}
              numberOfLines={3}>
              {content}
            </Text>
          </View>
          <View style={[styles.rowContainer, {alignItems: 'center'}]}>
            <TouchableOpacity
              onPress={() => onReply(props._id, props.user?.handleName)}>
              <Text style={[styles.text, {color: color.text, marginRight: 20}]}>
                Trả lời
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.text, {color: color.text}]}>
                xem bản dịch
              </Text>
            </TouchableOpacity>
          </View>
          {reply.length > 0 && (
            <View>
              {moreComment && (
                <View
                  style={{
                    width: '100%',
                  }}>
                  <FlashList
                    data={reply}
                    renderItem={renderItem}
                    estimatedItemSize={50}
                  />
                </View>
              )}
              <TouchableOpacity
                style={{marginLeft: 66, marginTop: 10}}
                onPress={() => {
                  setMoreComment(!moreComment);
                }}>
                {!moreComment ? (
                  <Text style={[styles.text, {color: color.text}]}>
                    Xem {reply.length} câu trả lời khác
                  </Text>
                ) : (
                  <Text style={[styles.text, {color: color.text}]}>
                    Ẩn câu trả lời
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.heartContainer}>
          <TouchableOpacity style={styles.blockIcon}>
            <Heart style={[styles.icon]} color={color.text}/>
          </TouchableOpacity>
          <Text style={[styles.text, {color: color.text}]}>4</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  blockImgReply: {
    width: 30,
    height: 30,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  imgUser: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    fontWeight: '500',
    marginVertical: 4,
  },
  blockIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  heartContainer: {
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    marginTop: 20,
    marginLeft: 10,
  },
});

export default CommentComponent;
