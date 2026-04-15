import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens as t } from '../../theme/tokens';
import { database } from '../../database';
import DayIntention from '../../database/models/DayIntention';
import { Q } from '@nozbe/watermelondb';

type Props = NativeStackScreenProps<RootStackParamList, 'SetIntentionModal'>;

const INTENTION_OPTIONS = [
  { id: 'energised', emoji: '⚡', label: 'Energised', desc: 'Ready to take on the day' },
  { id: 'calm',      emoji: '😌', label: 'Calm',      desc: 'Centred and at ease' },
  { id: 'focused',   emoji: '🎯', label: 'Focused',   desc: 'Sharp and on-task' },
  { id: 'happy',     emoji: '😊', label: 'Happy',     desc: 'Joyful and grateful' },
  { id: 'resilient', emoji: '🛡️', label: 'Resilient', desc: 'Ready for anything' },
];

export default function SetIntentionModal({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [existingIntention, setExistingIntention] = useState<DayIntention | null>(null);

  const todayString = new Date().toLocaleDateString('en-CA');

  // Load existing intention on mount
  useEffect(() => {
    const load = async () => {
      try {
        const existing = await database
          .get<DayIntention>('day_intentions')
          .query(Q.where('date', todayString))
          .fetch();
        if (existing.length > 0) {
          setExistingIntention(existing[0]);
          // Use the first saved intention id
          const ids = existing[0].targetMood.split(',').filter(Boolean);
          if (ids.length > 0) setSelected(ids[0]);
        }
      } catch (e) {
        console.warn('[SetIntentionModal] Load failed:', e);
      }
    };
    load();
  }, [todayString]);

  const handleSelect = (id: string) => {
    setSelected(prev => (prev === id ? null : id));
  };

  const handleSave = async () => {
    if (!selected || saving) return;
    setSaving(true);

    try {
      await database.write(async () => {
        if (existingIntention) {
          await existingIntention.update((intent) => {
            intent.targetMood = selected;
            intent.synced = false;
          });
        } else {
          await database.get<DayIntention>('day_intentions').create((intent) => {
            intent.userId = 'local';
            intent.targetMood = selected;
            intent.date = todayString;
            intent.synced = false;
          });
        }
      });

      console.log('[SetIntentionModal] Saved intention:', selected);
      navigation.goBack();
    } catch (error) {
      console.error('[SetIntentionModal] Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Dimmed backdrop */}
      <TouchableOpacity style={styles.backdrop} onPress={handleDismiss} activeOpacity={1} />

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />

        <Text style={styles.title}>set your intention</Text>
        <Text style={styles.subtitle}>how do you want to feel today?</Text>

        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {INTENTION_OPTIONS.map((item) => {
            const isSelected = selected === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.emojiWrap, isSelected && styles.emojiWrapSelected]}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.label, isSelected && styles.labelSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.desc}>{item.desc}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, !selected && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!selected || saving}
            activeOpacity={0.8}
          >
            <Text style={[styles.saveBtnText, !selected && styles.saveBtnTextDisabled]}>
              {saving ? 'Saving…' : existingIntention ? 'Update Intention' : 'Set Intention'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipLink} onPress={handleDismiss}>
            <Text style={styles.skipLinkText}>maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: t.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: t.spacing.padding,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: t.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: t.colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: t.colors.textSecondary,
    marginBottom: 20,
  },

  /* ---- Card-row list ---- */
  listScroll: {
    flexGrow: 0,
  },
  listContainer: {
    gap: 10,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.surface,
    borderRadius: t.borderRadius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: t.colors.border,
  },
  cardSelected: {
    borderColor: t.colors.brand,
    backgroundColor: t.colors.brandExtraLight,
  },
  emojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: t.colors.n100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emojiWrapSelected: {
    backgroundColor: t.colors.brandLight,
  },
  emoji: {
    fontSize: 22,
  },
  cardText: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: t.colors.textPrimary,
    marginBottom: 2,
  },
  labelSelected: {
    color: t.colors.brand,
  },
  desc: {
    fontSize: 12,
    color: t.colors.textTertiary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: t.colors.n300,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioSelected: {
    borderColor: t.colors.brand,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: t.colors.brand,
  },

  /* ---- Footer ---- */
  footer: {
    paddingTop: 16,
  },
  saveBtn: {
    backgroundColor: t.colors.brand,
    paddingVertical: 16,
    borderRadius: t.borderRadius.button,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: t.colors.n200,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  saveBtnTextDisabled: {
    color: t.colors.textTertiary,
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  skipLinkText: {
    fontSize: t.typography.body.fontSize,
    color: t.colors.textSecondary,
  },
});
