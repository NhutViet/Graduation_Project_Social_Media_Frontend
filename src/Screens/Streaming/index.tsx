import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../util/ThemeContext';
import {Colors} from '../../../assets/color/Colors';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {FlashList} from '@shopify/flash-list';
import {ArrowLeft, Eye, Send} from 'lucide-react-native';
import {Dimensions} from 'react-native';

interface ViewerType {
  id: string;
  name: string;
  avatar: string;
  comment: string;
}

interface CommentType {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

const {height: screenHeight} = Dimensions.get('window');
const bottomAreaHeight = screenHeight * 0.25;

export const Streaming = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const color = Colors[theme];
  const [message, setMessage] = useState('');
  const [viewers, _setViewers] = useState<ViewerType[]>([
    {
      id: '1',
      name: 'maxjacobson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      comment: 'Hello, how are you?',
    },
    {
      id: '2',
      name: 'jacobson',
      avatar: 'https://i.pravatar.cc/150?img=2',
      comment: 'Hello, how are you?',
    },
    {
      id: '3',
      name: 'hugh',
      avatar: 'https://i.pravatar.cc/150?img=3',
      comment: 'Hello, how are you?',
    },
    {
      id: '4',
      name: 'jason',
      avatar: 'https://i.pravatar.cc/150?img=4',
      comment: 'Hello, how are you?',
    },
    {
      id: '5',
      name: 'sophia',
      avatar: 'https://i.pravatar.cc/150?img=5',
      comment: 'Hello, how are you?',
    },
    {
      id: '6',
      name: 'emma',
      avatar: 'https://i.pravatar.cc/150?img=6',
      comment: 'Hello, how are you?',
    },
    {
      id: '7',
      name: 'oliver',
      avatar: 'https://i.pravatar.cc/150?img=7',
      comment: 'Hello, how are you?',
    },
    {
      id: '8',
      name: 'lucas',
      avatar: 'https://i.pravatar.cc/150?img=8',
      comment: 'Hello, how are you?',
    },
  ]);
  const [_comments, setComments] = useState<CommentType[]>([]);

  const renderViewers = (comment: ViewerType[]) => {
    return (
      <View style={styles.viewersContainer}>
        <View style={styles.views}>
          <FlashList
            data={comment}
            estimatedItemSize={50}
            renderItem={({item}) => (
              <View style={styles.viewerItem}>
                <Image
                  source={{uri: item.avatar}}
                  style={styles.viewerAvatar}
                />
                <View style={styles.viewerContent}>
                  <Text style={styles.viewerName}>{item.name}</Text>
                  <Text style={styles.joinedText}>joined</Text>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  };

  const reactions: string[] = [
    'Hello',
    '🤣',
    '❤️',
    '😘',
    '🤩',
    '🥳',
    '💪',
    '🥲',
    '📞',
    '🤡',
  ];
  const handleReactionPress = (reaction: string) => {
    setMessage(message + reaction);
  };
  const renderReactions = () => {
    return (
      <View style={styles.reactionsContainer}>
        <FlashList
          data={reactions}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={() => handleReactionPress(item)}>
              <Text style={styles.reactionText}>{item}</Text>
            </TouchableOpacity>
          )}
          estimatedItemSize={50}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };
  const handleSendMessage = () => {
    if (message.trim()) {
      const newComment = {
        id: Date.now().toString(),
        user: 'You',
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
      setComments(prev => [...prev, newComment]);
      setMessage('');
    }
  };

  return (
    <Video
      source={{
        uri: 'https://res.cloudinary.com/dsvcoywkc/video/upload/v1746957530/my_video/afezzsxayqcz9cpfbpsj.mp4',
      }}
      style={styles.videoContainer}>
      <SafeAreaView style={styles.overlayContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerMid}>
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.viewerCount}>
              <Eye size={16} color="white" style={{marginRight: 4}} />
              <Text style={styles.viewerText}>{viewers.length}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.endButton}>
            <Text style={styles.endButtonText}>End</Text>
          </TouchableOpacity>
        </View>
        {/* Main Content */}
        {renderViewers(viewers)}
        {/* Input Area */}
        <View style={styles.bottomArea}>
          {renderReactions()}
          <View style={styles.inputContainer}>
            <View style={styles.inputField}>
              <TextInput
                style={styles.input}
                placeholder="Type a comment..."
                placeholderTextColor={color.textSecondary}
                value={message}
                onChangeText={setMessage}
              />
              {message.length > 0 && (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}>
                  <Send size={24} color={color.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Video>
  );
};

const styles = StyleSheet.create({
  // Container styles
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerMid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  viewerCount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  viewerText: {
    color: 'white',
  },
  endButton: {
    backgroundColor: 'transparent',
  },
  endButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Viewers list styles
  viewersContainer: {
    position: 'absolute',
    bottom: bottomAreaHeight * 0.725,
    height: screenHeight / 3.75,
    width: '100%',
  },
  views: {
    flex: 1,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 10,
    marginVertical: 5,
  },
  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  viewerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerName: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
  },
  joinedText: {
    color: 'white',
    opacity: 0.8,
  },

  // Bottom area styles
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    marginBottom: 30,
  },
  // Reactions styles
  reactionsContainer: {
    marginVertical: 10,
  },
  reactionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 14,
    borderRadius: 20,
    marginLeft: 8,
  },
  reactionText: {
    color: 'white',
    fontSize: 16,
  },
  // Input area styles
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'white',
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
});
