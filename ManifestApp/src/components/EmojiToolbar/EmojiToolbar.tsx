import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SwedishForestTheme } from '../../theme/SwedishForestTheme';

interface EmojiToolbarProps {
  onEmojiPress: (emoji: string) => void;
}

export const EmojiToolbar: React.FC<EmojiToolbarProps> = ({ onEmojiPress }) => {
  // Svenska tacksamhets-emojis
  const gratitudeEmojis = [
    '🌿', '😊', '❤️', '🌟', '☀️', '🌸',
    '🙏', '💚', '✨', '🌺', '🍃', '💛',
    '🌻', '🌈', '🦋', '🌙', '⭐', '💫',
    '🔥', '🌷', '🌼', '🍀', '💝', '🎉'
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tryck för att lägga till i texten ↑</Text>
      <ScrollView 
        horizontal 
        style={styles.emojiScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.emojiContainer}
      >
        {gratitudeEmojis.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={styles.emojiButton}
            onPress={() => onEmojiPress(emoji)}
            activeOpacity={0.6}
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
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.text.secondary,
    marginBottom: SwedishForestTheme.spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
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
    borderWidth: 1,
    borderColor: SwedishForestTheme.colors.text.disabled,
    shadowColor: SwedishForestTheme.colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  emoji: {
    fontSize: 24,
  },
});