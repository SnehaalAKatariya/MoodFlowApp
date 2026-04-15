import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens } from '../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'MoodShift'>;

export default function MoodShift({ navigation }: Props) {
  
  const handlePlaylist = () => {
    // Simulated deep link opening
    Linking.openURL('https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ');
    // For MVP, we navigate back after action
    navigation.goBack();
  };

  const handleBreathe = () => {
    // Would route to breathe guide
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.icon}>🫂</Text>
        <Text style={styles.title}>Want to shift this?</Text>
        <Text style={styles.subtitle}>You recorded a lower mood. Feeling stuck? Try a small intervention.</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.actionCard} onPress={handlePlaylist}>
          <Text style={styles.actionIcon}>🎧</Text>
          <View>
            <Text style={styles.actionTitle}>Mood Shift Playlist</Text>
            <Text style={styles.actionDesc}>Listen on Spotify</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleBreathe}>
          <Text style={styles.actionIcon}>{'\uD83C\uDF2C\uFE0F'}</Text>
          <View>
            <Text style={styles.actionTitle}>Breathe (2 min)</Text>
            <Text style={styles.actionDesc}>4-7-8 breathing exercise</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>No thanks, I'll pass</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
    padding: DesignTokens.spacing.padding,
  },
  hero: {
    marginTop: 100,
    marginBottom: 40,
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    ...DesignTokens.typography.h1,
    fontSize: 24,
    marginBottom: 12,
  },
  subtitle: {
    ...DesignTokens.typography.body,
    color: DesignTokens.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: DesignTokens.colors.surface,
    padding: 20,
    borderRadius: DesignTokens.borderRadius.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionTitle: {
    ...DesignTokens.typography.h1,
    fontSize: 16,
    marginBottom: 4,
  },
  actionDesc: {
    ...DesignTokens.typography.body,
    color: DesignTokens.colors.textSecondary,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    ...DesignTokens.typography.body,
    color: DesignTokens.colors.textSecondary,
  },
});
