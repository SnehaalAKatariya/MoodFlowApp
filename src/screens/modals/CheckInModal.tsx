import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens } from '../../theme/tokens';
import { database } from '../../database';
import MoodLog from '../../database/models/MoodLog';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckInModal'>;

const MOODS = [
  { score: 5, emoji: '🤩', label: 'Great' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 2, emoji: '😞', label: 'Low' },
  { score: 1, emoji: '😫', label: 'Rough' },
];

const TAGS = ['work', 'sleep', 'food', 'social', 'exercise'];

const CONFETTI_COUNT = 30;
const CONFETTI_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#6C5CE7',
  '#A8E6CF', '#FF8A5B', '#EA5455', '#2ED573', '#1E90FF',
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPiece {
  animX: Animated.Value;
  animY: Animated.Value;
  animRotate: Animated.Value;
  animOpacity: Animated.Value;
  color: string;
  size: number;
}

function createConfettiPieces(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, () => ({
    animX: new Animated.Value(0),
    animY: new Animated.Value(0),
    animRotate: new Animated.Value(0),
    animOpacity: new Animated.Value(1),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 6,
  }));
}

export default function CheckInModal({ navigation }: Props) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiPieces = useRef<ConfettiPiece[]>(createConfettiPieces()).current;
  // Store the selected mood so confetti callback can read it after state resets
  const savedMoodRef = useRef<number>(0);

  const fireConfetti = useCallback(() => {
    setShowConfetti(true);

    const animations = confettiPieces.map((piece) => {
      // Reset
      piece.animX.setValue(0);
      piece.animY.setValue(0);
      piece.animRotate.setValue(0);
      piece.animOpacity.setValue(1);

      const targetX = (Math.random() - 0.5) * SCREEN_WIDTH * 0.8;
      const targetY = -(100 + Math.random() * 250); // shoot upward
      const duration = 500 + Math.random() * 300;

      return Animated.parallel([
        Animated.timing(piece.animX, {
          toValue: targetX,
          duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(piece.animY, {
            toValue: targetY,
            duration: duration * 0.4,
            useNativeDriver: true,
          }),
          Animated.timing(piece.animY, {
            toValue: targetY + 400, // gravity fall
            duration: duration * 0.6,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(piece.animRotate, {
          toValue: 2 + Math.random() * 4,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(piece.animOpacity, {
          toValue: 0,
          duration,
          delay: duration * 0.5,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(15, animations).start(() => {
      setShowConfetti(false);
      // Navigate after confetti finishes
      if (savedMoodRef.current <= 2) {
        navigation.replace('MoodShift');
      } else {
        navigation.goBack();
      }
    });
  }, [confettiPieces, navigation]);

  const handleSave = async () => {
    if (!selectedMood || saving) return;
    setSaving(true);
    savedMoodRef.current = selectedMood;

    try {
      // Save to WatermelonDB
      await database.write(async () => {
        await database.get<MoodLog>('mood_logs').create((log) => {
          log.userId = 'local'; // Will be replaced with actual user ID when auth is wired
          log.moodScore = selectedMood;
          log.tag = selectedTag ?? undefined;
          log.loggedAt = Date.now();
          log.source = 'manual';
          log.synced = false;
        });
      });

      console.log('[CheckInModal] Saved MoodLog to WatermelonDB:', {
        moodScore: selectedMood,
        tag: selectedTag,
        loggedAt: Date.now(),
      });
    } catch (e: any) {
      // Log but do NOT block — the user's action matters most
      console.warn('[CheckInModal] WatermelonDB save failed:', e.message);
    } finally {
      setSaving(false);
      // Fire confetti, navigation happens after confetti completes
      fireConfetti();
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Dimmed backdrop area */}
      <TouchableOpacity style={styles.backdrop} onPress={handleSkip} activeOpacity={1} />

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />
        <Text style={styles.timestamp}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Today
        </Text>
        <Text style={styles.prompt}>how are you feeling?</Text>

        <View style={styles.moodGrid}>
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.score;
            return (
              <TouchableOpacity
                key={m.score}
                style={[styles.moodCell, isSelected && styles.moodCellSelected]}
                onPress={() => setSelectedMood(m.score)}
                activeOpacity={0.7}
              >
                <Text style={styles.emoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>add a tag — optional</Text>
        <View style={styles.tagGroup}>
          {TAGS.map((t) => {
            const isSelected = selectedTag === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                onPress={() => setSelectedTag(t === selectedTag ? null : t)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, !selectedMood && styles.saveBtnDisabled]}
            disabled={!selectedMood || saving}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={[styles.saveBtnText, !selectedMood && styles.saveBtnTextDisabled]}>
              {saving ? 'Saving…' : 'Save'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipLink} onPress={handleSkip}>
            <Text style={styles.skipLinkText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confetti Overlay */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          {confettiPieces.map((piece, i) => {
            const spin = piece.animRotate.interpolate({
              inputRange: [0, 6],
              outputRange: ['0deg', '2160deg'],
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.confettiPiece,
                  {
                    width: piece.size,
                    height: piece.size * 1.4,
                    backgroundColor: piece.color,
                    borderRadius: piece.size * 0.2,
                    opacity: piece.animOpacity,
                    transform: [
                      { translateX: piece.animX },
                      { translateY: piece.animY },
                      { rotate: spin },
                    ],
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: DesignTokens.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: DesignTokens.spacing.padding,
    paddingBottom: 40,
    minHeight: '75%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: DesignTokens.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  timestamp: {
    fontSize: DesignTokens.typography.micro.fontSize,
    fontWeight: DesignTokens.typography.micro.fontWeight as '500',
    color: DesignTokens.typography.micro.color,
    textAlign: 'center',
    marginBottom: 16,
  },
  prompt: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: DesignTokens.typography.h1.color,
    textAlign: 'center',
    marginBottom: 32,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  moodCell: {
    alignItems: 'center',
    padding: 10,
    borderRadius: DesignTokens.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 2,
  },
  moodCellSelected: {
    borderColor: DesignTokens.colors.brand,
    backgroundColor: DesignTokens.colors.brandExtraLight,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: DesignTokens.typography.micro.fontSize,
    fontWeight: DesignTokens.typography.micro.fontWeight as '500',
    color: DesignTokens.colors.textSecondary,
  },
  moodLabelSelected: {
    color: DesignTokens.colors.brand,
    fontWeight: '700' as const,
  },
  sectionLabel: {
    fontSize: DesignTokens.typography.body.fontSize,
    fontWeight: DesignTokens.typography.body.fontWeight as '500',
    color: DesignTokens.colors.textSecondary,
    marginBottom: 12,
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 40,
  },
  tagPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: DesignTokens.colors.surface,
    borderWidth: 1.5,
    borderColor: DesignTokens.colors.border,
  },
  tagPillSelected: {
    borderColor: DesignTokens.colors.brand,
    backgroundColor: DesignTokens.colors.brandExtraLight,
  },
  tagText: {
    fontSize: DesignTokens.typography.body.fontSize,
    fontWeight: DesignTokens.typography.body.fontWeight as '500',
    color: DesignTokens.colors.textSecondary,
  },
  tagTextSelected: {
    color: DesignTokens.colors.brand,
    fontWeight: '700' as const,
  },
  footer: {
    marginTop: 'auto',
  },
  saveBtn: {
    backgroundColor: DesignTokens.colors.brand,
    paddingVertical: 16,
    borderRadius: DesignTokens.borderRadius.button,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: DesignTokens.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: DesignTokens.colors.n200,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  saveBtnTextDisabled: {
    color: DesignTokens.colors.textTertiary,
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipLinkText: {
    fontSize: DesignTokens.typography.body.fontSize,
    fontWeight: DesignTokens.typography.body.fontWeight as '500',
    color: DesignTokens.colors.textSecondary,
  },
  // Confetti
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  confettiPiece: {
    position: 'absolute',
  },
});
