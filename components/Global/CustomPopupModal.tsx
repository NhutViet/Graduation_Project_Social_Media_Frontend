import {Colors} from '@assets/color/Colors';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from '../../src/util/ThemeContext';

const {height} = Dimensions.get('window');

export interface CustomPopupModalRef {
  open: () => void;
  close: () => void;
}

interface CustomPopupModalProps {
  children: ReactNode;
  onCancel?: () => void;
  showCancelButton?: boolean;
  cancelText?: string;
  cancelTextColor?: string;
  backgroundColor?: string;
  title?: string;
}

const CustomPopupModal = forwardRef<CustomPopupModalRef, CustomPopupModalProps>(
  (
    {
      children,
      onCancel,
      showCancelButton = true,
      cancelText = 'Huỷ',
      cancelTextColor = '#ff3b30',
      backgroundColor,
      title,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(height)).current;
    const {theme} = useTheme();
    const colors = Colors[theme];
    backgroundColor = backgroundColor ?? colors.background;

    const open = useCallback(() => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const close = useCallback(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ]).start(() => {
        setVisible(false);
      });
    }, []);

    useImperativeHandle(ref, () => ({open, close}));

    if (!visible) return null;

    return (
      <Modal transparent visible={visible} animationType="none">
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View style={[styles.backdrop, {opacity}]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{translateY}],
            },
          ]}>
          <View style={styles.sheetContent}>
            <View style={[styles.contentWrapper, {backgroundColor}]}>
              {title && (
                <Text style={[styles.title, {color: colors.text}]}>
                  {title}
                </Text>
              )}
              {children}
            </View>

            {showCancelButton && (
              <TouchableOpacity
                onPress={onCancel ?? close}
                style={[styles.cancelButton, {backgroundColor}]}>
                <Text style={[styles.cancelText, {color: cancelTextColor}]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Modal>
    );
  },
);

export default CustomPopupModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  sheetContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentWrapper: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
