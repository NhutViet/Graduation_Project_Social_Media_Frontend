import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

type AlertContextType = {
  showAlert: (title: string, message: string, duration?: number) => void;
};

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
});

export const useHeadAlert = () => useContext(AlertContext);

type Props = {
  children: ReactNode;
};

export const HeadAlertProvider: React.FC<Props> = ({children}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const HEIGHT = 80;
  const translateY = useRef(new Animated.Value(-HEIGHT)).current;

  // PanResponder để vuốt lên đóng
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => visible,
      onPanResponderMove: (_, {dy}) => {
        if (dy < 0) {
          translateY.setValue(dy);
        }
      },
      onPanResponderRelease: (_, {dy, vy}) => {
        if (dy < -40 || vy < -0.5) {
          hide();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const show = (
    newTitle: string,
    newMessage: string,
    duration: number = 3000,
  ) => {
    clearTimeout(timeoutRef.current);
    setTitle(newTitle);
    setMessage(newMessage);
    setVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    // tự ẩn sau duration (mặc định 3s)
    timeoutRef.current = setTimeout(hide, duration);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    Animated.timing(translateY, {
      toValue: -HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  // clean up on unmount
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <AlertContext.Provider value={{showAlert: show}}>
      {children}
      {visible && (
        <Animated.View
          style={[styles.container, {transform: [{translateY}]}]}
          {...panResponder.panHandlers}>
          <TouchableWithoutFeedback onPress={hide}>
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.message} numberOfLines={2}>
                {message}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 60,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
});
