import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens as t } from '../../theme/tokens';
import { useOnboardingStore } from '../../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

export default function Schedule({ navigation }: Props) {
  const { wakeTime, sleepTime, checkInIntervalHours, setSchedule } = useOnboardingStore();

  const handleContinue = () => {
    // Skip Anchors — intentions are set from Home via SetIntentionModal
    navigation.navigate('Permission');
  };

  const intervals = [1, 2, 3];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.stepText}>Step 1 of 2</Text>
        </View>

        <Text style={styles.title}>when do you wake up?</Text>
        <Text style={styles.subtitle}>we'll only nudge you during your day</Text>
        
        {/* Time Card */}
        <View style={styles.card}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>wake time</Text>
            <Text style={styles.timeValue}>{wakeTime}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>sleep time</Text>
            <Text style={styles.timeValue}>{sleepTime}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>check-in every</Text>
        
        {/* Interval Selector */}
        <View style={styles.intervalGroup}>
          {intervals.map(h => {
            const isActive = checkInIntervalHours === h;
            return (
              <TouchableOpacity 
                key={h}
                activeOpacity={0.7}
                style={[styles.intervalBtn, isActive && styles.intervalBtnActive]}
                onPress={() => setSchedule(wakeTime, sleepTime, h)}
              >
                <Text style={[styles.intervalBtnText, isActive && styles.intervalTextActive]}>
                  {h}h
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Custom placeholder for UX parity */}
          <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.intervalBtn}
          >
            <Text style={styles.intervalBtnText}>custom</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Fixed bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.primaryBtn} onPress={handleContinue}>
          <Text style={styles.primaryBtnText}>continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  scrollContent: {
    padding: t.spacing.padding,
    paddingTop: 60,
    paddingBottom: 100, // Space for fixed footer
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: t.colors.n300,
  },
  dotActive: {
    backgroundColor: t.colors.n900,
  },
  stepText: {
    fontSize: 10,
    color: t.colors.n400,
    marginLeft: 8,
  },
  title: {
    color: t.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: t.colors.n500,
    fontSize: 13,
    marginBottom: 24,
  },
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.borderRadius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: t.colors.n200,
    marginBottom: 24,
  },
  timeRow: {
    paddingVertical: 4,
  },
  timeLabel: {
    color: t.colors.n500,
    fontSize: 11,
    marginBottom: 4,
  },
  timeValue: {
    color: t.colors.n900,
    fontSize: 17,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: t.colors.n200,
    marginVertical: 12,
  },
  sectionHeader: {
    color: t.colors.n800,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  intervalGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  intervalBtn: {
    flex: 1,
    height: 40,
    backgroundColor: t.colors.surface,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: t.colors.n200,
  },
  intervalBtnActive: {
    borderColor: t.colors.brand,
    backgroundColor: t.colors.brandExtraLight,
  },
  intervalBtnText: {
    color: t.colors.n700,
    fontSize: 13,
  },
  intervalTextActive: {
    fontWeight: '600',
    color: t.colors.brand,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: t.spacing.padding,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  primaryBtn: {
    backgroundColor: t.colors.brand,
    height: 52,
    borderRadius: t.borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
