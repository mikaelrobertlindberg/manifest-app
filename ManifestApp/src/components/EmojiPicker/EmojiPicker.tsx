import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SwedishForestTheme } from '../../theme/SwedishForestTheme';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  selectedEmoji
}) => {
  // Svenska tacksamhets-emojis
  const gratitudeEmojis = [
    '🌿', '😊', '❤️', '🌟', '☀️', '🌸',
    '🙏', '💚', '✨', '🌺', '🍃', '💛',
    '🌻', '🌈', '🦋', '🌙', '⭐', '💫',
    '🔥', '🌷', '🌼', '🍀', '💝', '🎉'
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Välj en känsla 😊</Text>
      <ScrollView 
        horizontal 
        style={styles.emojiScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.emojiContainer}
      >
        {gratitudeEmojis.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji && styles.selectedEmojiButton
            ]}
            onPress={() => onEmojiSelect(emoji)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SwedishForestTheme.spacing.lg,
  },
  
  label: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    marginBottom: SwedishForestTheme.spacing.sm,
    textAlign: 'center',
  },
  
  emojiScroll: {
    maxHeight: 60,
  },
  
  emojiContainer: {
    paddingHorizontal: SwedishForestTheme.spacing.sm,
    alignItems: 'center',
  },
  
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SwedishForestTheme.colors.surface,
    marginHorizontal: SwedishForestTheme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  selectedEmojiButton: {
    borderColor: SwedishForestTheme.colors.primary,
    backgroundColor: SwedishForestTheme.colors.background,
  },
  
  emoji: {
    fontSize: 24,
  },
});