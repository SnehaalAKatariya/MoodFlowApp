import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens } from '../../theme/tokens';
import * as Notifications from 'expo-notifications';
import { useOnboardingStore } from '../../store';
import { database } from '../../database';
import User from '../../database/models/User';

type Props = NativeStackScreenProps<RootStackParamList, 'Permission'>;

export default function Permission({ navigation }: Props) {
  const { wakeTime, sleepTime, checkInIntervalHours, anchorMoods } =
    useOnboardingStore();

  /** Persist Zustand onboarding state → WatermelonDB users table */
  const finaliseOnboarding = async () => {
    await database.write(async () => {
      await database.get<User>('users').create((user) => {
        user.wakeTime = wakeTime;
        user.sleepTime = sleepTime;
        user.checkInIntervalH = checkInIntervalHours;
        user.anchorMoods = anchorMoods;
        user.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        user.onboardingDone = true;
      });
    });
  };

  const handleAllow = async () => {
    await Notifications.requestPermissionsAsync();
    await finaliseOnboarding();
    navigation.replace('Home');
  };

  const handleNotNow = async () => {
    await finaliseOnboarding();
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.icon}>🔔</Text>
        <Text style={styles.title}>one last thing</Text>
        <Text style={styles.subtitle}>We need your permission to send hourly check-in nudges.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleAllow}>
          <Text style={styles.primaryBtnText}>Allow Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleNotNow}>
          <Text style={styles.secondaryBtnText}>Not Now</Text>
        </TouchableOpacity>
        <Text style={styles.micro}>you can always enable this later in settings.</Text>
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
    flex: 1,
    justifyContent: 'center',
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
    paddingHorizontal: 24,
  },
  footer: {
    paddingBottom: 40,
  },
  primaryBtn: {
    backgroundColor: DesignTokens.colors.buttonPrimary,
    paddingVertical: 16,
    borderRadius: DesignTokens.borderRadius.button,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    ...DesignTokens.typography.h1,
    fontSize: 15,
  },
  secondaryBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryBtnText: {
    ...DesignTokens.typography.body,
  },
  micro: {
    ...DesignTokens.typography.micro,
    textAlign: 'center',
  },
});
