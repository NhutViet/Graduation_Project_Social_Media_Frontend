import React, {useEffect, useRef} from 'react';
import {Animated, Text, View, TouchableOpacity, StyleSheet} from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
  onAction?: () => void;
}

const NotificationModal = ({
  visible,
  title,
  body,
  onClose,
  onAction,
}: Props) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, 4000);
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, translateY, opacity]);

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onClose();
  };

  const handlePress = () => {
    if (onAction) {
      onAction();
    }
    handleClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.notification,
          {
            transform: [{translateY}],
            opacity,
          },
        ]}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={handlePress}
          activeOpacity={0.9}>
          <View style={styles.content}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🔔</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.body} numberOfLines={2}>
                {body}
              </Text>
            </View>

            <View style={styles.actionIndicator}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  notification: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  touchable: {
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F0FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CDE2FB',
  },
  avatarText: {
    fontSize: 22,
    color: '#0095F6',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  body: {
    color: '#555',
    fontSize: 14,
    lineHeight: 18,
  },
  actionIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  arrow: {
    fontSize: 16,
    color: '#0095F6',
    fontWeight: 'bold',
  },
});

export default NotificationModal;
