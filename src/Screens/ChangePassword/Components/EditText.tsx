import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {Eye, EyeOff} from 'lucide-react-native';

interface EditTextProps {
  placeholder?: string;
  password?: boolean;
  value: string;
  valueChange: (text: string) => void;
}

const EditText = (props: EditTextProps) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {placeholder, password, value, valueChange} = props;
  const [isVisiblePass, setIsVibisblePass] = useState(!password);
  return (
    <View>
      <TextInput
        style={[
          styles.container,
          {
            color: color.text,
            borderColor: color.gray,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={color.textSecondary}
        secureTextEntry={!isVisiblePass}
        value={value}
        onChangeText={valueChange}
      />
      {password && (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setIsVibisblePass(!isVisiblePass)}>
          {isVisiblePass ? (
            <Eye size={20} color={color.textSecondary} />
          ) : (
            <EyeOff size={20} color={color.textSecondary} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EditText;

const styles = StyleSheet.create({
  container: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
  },
  icon: {
    position: 'absolute',
    alignItems: 'center',
    right: 15,
    top: 17,
    height: '100%',
  },
});
