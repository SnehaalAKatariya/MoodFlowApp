import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { DesignTokens as theme } from '../theme/tokens';
import { useAuth } from '@clerk/clerk-expo';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function Settings() {
  const navigation = useNavigation<NavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);
  const { signOut, isSignedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (e: any) {
      console.error(e);
      Alert.alert('Logout failed', e.message || 'Please try again.');
    }
  };

  const handleClearData = () => {
    // Basic stub for clear data
    Alert.alert('Clear Data', 'Are you sure you want to clear all data? This cannot be undone.');
  };

  const handleDeleteAccount = () => {
    // Basic stub for delete account
    Alert.alert('Delete Account', 'Are you sure you want to delete your account?');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Wake time</Text>
              <Text style={styles.rowValue}>07:00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Sleep time</Text>
              <Text style={styles.rowValue}>23:00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Check-in interval</Text>
              <Text style={styles.rowValue}>2 hours</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Allow notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: theme.colors.border, true: theme.colors.textPrimary }}
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.card}>
            {isSignedIn ? (
              <>
                <TouchableOpacity style={styles.row} onPress={handleLogout}>
                  <Text style={styles.rowLabel}>Log out</Text>
                  <Text style={[styles.rowValue, { color: theme.colors.brand }]}>Sign out →</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.row} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] })}>
                  <Text style={styles.rowLabel}>Save your data</Text>
                  <Text style={styles.rowValue}>Sign in →</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </>
            )}
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowLabel}>Export data</Text>
              <Text style={styles.rowValue}>.json</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Dark mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: theme.colors.border, true: theme.colors.textPrimary }}
              />
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, styles.dangerLabel]}>DANGER ZONE</Text>
          <View style={[styles.card, styles.dangerCard]}>
            <TouchableOpacity style={styles.row} onPress={handleClearData}>
              <Text style={[styles.rowLabel, styles.dangerText]}>Clear all local data</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
              <Text style={[styles.rowLabel, styles.dangerText]}>Delete account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.versionLabel}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 24,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.h1.fontSize,
    fontFamily: theme.typography.h1.fontFamily,
    fontWeight: theme.typography.h1.fontWeight as any,
  },
  scrollContent: {
    padding: theme.spacing.screenPadding,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight as any,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  dangerLabel: {
    color: '#FF453A',
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    borderWidth: theme.borderWeight.default,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  dangerCard: {
    borderColor: 'rgba(255, 69, 58, 0.3)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rowLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
  },
  rowValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
  dangerText: {
    color: '#FF453A',
  },
  divider: {
    height: theme.borderWeight.default,
    backgroundColor: theme.colors.border,
    marginLeft: 16,
  },
  versionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.micro.fontSize,
    textAlign: 'center',
    marginTop: 16,
  },
});
