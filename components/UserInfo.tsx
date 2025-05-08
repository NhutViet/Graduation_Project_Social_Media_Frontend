import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { AutoGrowingInput } from './AutoGrowTexts';
import { useProfileEditingStyles } from '../src/StyleSheet/ProfileEditingStyles';

type Row = {
    label: string;
    value?: string;
    placeholder?: string;
  };
  
  type UserInfoProps = {
    title?: string;
    subtitle?: string;
    rows: Row[];
  };
  
  export const UserInfo: React.FC<UserInfoProps> = ({ title, subtitle, rows }) => {
    const styles = useProfileEditingStyles();
  
    return (
      <View style={styles.container}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {rows.map((row, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <AutoGrowingInput
              style={[styles.input, { minHeight: 40 }]}
              value={row.value}
              placeholder={row.placeholder ?? row.label}
              placeholderTextColor="#979797"
            />
          </View>
        ))}
      </View>
    );
  };

  export default UserInfo;