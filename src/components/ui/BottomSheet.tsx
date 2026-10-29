import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  handleIndicator?: boolean;
  testID?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  handleIndicator = true,
  testID,
}: BottomSheetProps) {
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <View style={styles.overlay} accessibilityViewIsModal onStartShouldSetResponder={() => true}>
      <Pressable onPress={onClose} style={styles.backdrop} accessible={false} />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius.sheet,
            borderTopRightRadius: theme.radius.sheet,
          },
        ]}
        testID={testID}
      >
        {handleIndicator && (
          <View style={[styles.indicator, { backgroundColor: theme.colors.border }]} />
        )}
        {title && (
          <View style={styles.titleBar}>
            <Text style={[theme.typography.h3, { color: theme.colors.text }]}>{title}</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close" hitSlop={12}>
              <View style={styles.close} />
            </Pressable>
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    paddingBottom: 24,
    maxHeight: '85%',
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  close: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 20,
  },
});
