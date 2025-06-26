import React, {useState, useImperativeHandle, forwardRef, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const {width} = Dimensions.get('window');

export interface GlobalAlertRef {
  show: (title: string, message: string, onConfirm?: () => void) => void;
}

export interface GlobalAlertProps {}

class GlobalAlertManager {
  private static alertRef: GlobalAlertRef | null = null;

  static setAlertRef(ref: GlobalAlertRef | null): void {
    this.alertRef = ref;
  }

  static show(title: string, message: string, onConfirm?: () => void): void {
    if (this.alertRef) {
      this.alertRef.show(title, message, onConfirm);
    }
  }
}

const GlobalAlert = forwardRef<GlobalAlertRef, GlobalAlertProps>(
  (props, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useImperativeHandle(
      ref,
      (): GlobalAlertRef => ({
        show: (
          alertTitle: string,
          alertMessage: string,
          confirmCallback: () => void = () => {},
        ) => {
          setTitle(alertTitle);
          setMessage(alertMessage);
          setOnConfirm(() => confirmCallback);
          setVisible(true);

          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        },
      }),
    );

    const hideAlert = (): void => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        onConfirm();
      });
    };

    if (!visible) return null;

    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        statusBarTranslucent>
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
        <Animated.View style={[styles.overlay, {opacity: opacityAnim}]}>
          <Animated.View
            style={[
              styles.alertContainer,
              {
                transform: [{scale: scaleAnim}],
              },
            ]}>
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>ⓘ</Text>
              </View>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={hideAlert}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
    maxWidth: width - 60,
    minWidth: width * 0.8,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  message: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 120,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export {GlobalAlert, GlobalAlertManager};
