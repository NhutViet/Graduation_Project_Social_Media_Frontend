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
  PanResponder,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {Info} from 'lucide-react-native';

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
    timeoutRef.current = setTimeout(hide, 3000);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    Animated.timing(translateY, {
      toValue: -HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <AlertContext.Provider value={{showAlert: show}}>
      {children}
      {visible && (
        <Animated.View
          style={[styles.container, {transform: [{translateY}]}]}
          {...panResponder.panHandlers}>
          <TouchableWithoutFeedback onPress={hide}>
            <View style={styles.alertBox}>
              <Info size={20} color="#007AFF" style={{marginRight: 10}} />
              <View style={{flex: 1}}>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.message} numberOfLines={2}>
                  {message}
                </Text>
              </View>
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
    top: 20,
    left: 16,
    right: 16,
    height: 80,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  alertBox: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    ...Platform.select({
      android: {
        elevation: 10,
      },
    }),
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
});
