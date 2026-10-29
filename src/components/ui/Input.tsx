import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helper?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url'
    | 'visible-password';
  accessibilityLabel?: string;
  testID?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  helper,
  multiline = false,
  numberOfLines,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  accessibilityLabel,
  testID,
}: InputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[theme.typography.caption, styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      <TextInput
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceAlt,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.radius.input,
            color: theme.colors.text,
            fontSize: 15,
            lineHeight: 22,
            paddingHorizontal: 12,
            paddingVertical: multiline ? 12 : 10,
            minHeight: multiline ? 80 : 48,
          },
        ]}
        testID={testID}
      />
      {error && (
        <Text style={[theme.typography.caption, styles.helper, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
      {!error && helper && (
        <Text
          style={[theme.typography.caption, styles.helper, { color: theme.colors.textSecondary }]}
        >
          {helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    marginLeft: 4,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  helper: {
    marginLeft: 4,
  },
});
