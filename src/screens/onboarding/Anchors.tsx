import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens as t } from '../../theme/tokens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Anchors'>;

const ANCHOR_OPTIONS = [
  { id: 'energised', emoji: '⚡', label: 'Energised' },
  { id: 'calm',      emoji: '😌', label: 'Calm' },
  { id: 'focused',   emoji: '🎯', label: 'Focused' },
  { id: 'happy',     emoji: '😊', label: 'Happy' },
  { id: 'resilient', emoji: '🛡️', label: 'Resilient' },
  { id: 'curious',   emoji: '🤔', label: 'Curious' },
  { id: 'peaceful',  emoji: '🕊️', label: 'Peaceful' },
  { id: 'motivated', emoji: '🚀', label: 'Motivated' },
];

const TODAY_KEY = () => `intention_${new Date().toLocaleDateString('en-CA')}`;

export default function Anchors({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  // Load today's intention from storage on focus
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stored = await AsyncStorage.getItem(TODAY_KEY());
        if (stored) {
          setSelected(JSON.parse(stored));
          setSaved(true);
        } else {
          setSelected([]);
          setSaved(false);
        }
      };
      load();
    }, [])
  );

  const toggle = (id: string) => {
    setSaved(false);
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const handleSet = async () => {
    if (selected.length === 0) return;
    await AsyncStorage.setItem(TODAY_KEY(), JSON.stringify(selected));
    setSaved(true);
    navigation.goBack();
  };

  // If coming from onboarding (no back button), navigate to Permission
  const isOnboarding = navigation.getState().routes.some(r => r.name === 'Schedule');

  const handleContinue = async () => {
    if (selected.length > 0) {
      await AsyncStorage.setItem(TODAY_KEY(), JSON.stringify(selected));
    }
    navigation.navigate('Permission');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>today's intention</Text>
        <Text style={styles.subtitle}>pick 1 to 3 moods you want to feel today</Text>

        <View style={styles.gridContainer}>
          {ANCHOR_OPTIONS.map(item => {
            const isSelected = selected.includes(item.id);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  isDisabled && styles.cardDisabled,
                ]}
                onPress={() => toggle(item.id)}
                activeOpacity={isDisabled ? 1 : 0.7}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {item.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {saved && (
          <View style={styles.savedBadge}>
            <Text style={styles.savedText}>✓ Intention set for today — resets tomorrow</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.counter}>
          {selected.length} of 3 selected
        </Text>
        {isOnboarding ? (
          <TouchableOpacity
            style={[styles.primaryBtn, selected.length === 0 && styles.primaryBtnDisabled]}
            onPress={handleContinue}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryBtn, selected.length === 0 && styles.primaryBtnDisabled]}
            onPress={handleSet}
            disabled={selected.length === 0}
          >
            <Text style={styles.primaryBtnText}>
              {saved ? 'Update Intention' : 'Set Intention'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    padding: t.spacing.padding,
    paddingTop: 60,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: t.colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: t.colors.textSecondary,
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: t.colors.surface,
    borderRadius: t.borderRadius.mood,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: t.colors.brand,
    backgroundColor: t.colors.brandExtraLight,
  },
  cardDisabled: {
    opacity: 0.35,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: t.colors.textSecondary,
  },
  labelSelected: {
    color: t.colors.brand,
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: t.colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  savedBadge: {
    marginTop: 20,
    backgroundColor: t.colors.successLight,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  savedText: {
    color: t.colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  counter: {
    fontSize: 12,
    color: t.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: t.colors.brand,
    paddingVertical: 16,
    borderRadius: t.borderRadius.button,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: t.colors.n300,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
