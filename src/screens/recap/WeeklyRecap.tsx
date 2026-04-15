import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens as theme } from '../../theme/tokens';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WeeklyRecap'>;

export default function WeeklyRecap() {
  const navigation = useNavigation<NavigationProp>();
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        
        if (Platform.OS === 'web') {
           console.log('Sharing is not supported on web natively, image URI:', uri);
           alert('Sharing not available on web preview.');
           return;
        }
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            dialogTitle: 'My week in moods • moodflow.app'
          });
        }
      }
    } catch (error) {
      console.error('Failed to capture and share:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>week of Apr 7</Text>
        <TouchableOpacity onPress={handleShare}>
           <Text style={styles.shareTextTop}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
          <View style={styles.recapCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.checkinCount}>14 check-ins</Text>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>5🔥</Text>
              </View>
            </View>

            {/* Mood Curve Card */}
            <View style={styles.chartCard}>
              <View style={styles.chartArea}>
                {/* Simulated Chart Bars */}
                <View style={styles.barColumn}>
                  <View style={[styles.bar, { height: '60%' }]} />
                  <Text style={styles.dayLabel}>M</Text>
                </View>
                <View style={styles.barColumn}>
                  <View style={[styles.bar, { height: '30%' }]} />
                  <Text style={styles.dayLabel}>T</Text>
                </View>
                <View style={styles.barColumn}>
                  <View style={[styles.bar, { height: '50%' }]} />
                  <Text style={styles.dayLabel}>W</Text>
                </View>
                <View style={styles.barColumn}>
                  <View style={[styles.bar, { height: '80%', backgroundColor: theme.colors.textPrimary }]} />
                  <Text style={[styles.dayLabel, { color: theme.colors.textPrimary }]}>T</Text>
                </View>
                <View style={styles.barColumn}>
                  <View style={[styles.bar, { height: '40%' }]} />
                  <Text style={styles.dayLabel}>F</Text>
                </View>
                <View style={styles.barColumn}>
                  <View style={[styles.bar, { height: '70%' }]} />
                  <Text style={styles.dayLabel}>S</Text>
                </View>
                <View style={styles.barColumn}>
                  <View style={[styles.bar, { height: '90%' }]} />
                  <Text style={styles.dayLabel}>S</Text>
                </View>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Peak Day</Text>
                <Text style={styles.statValue}>Sunday</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Top Tag</Text>
                <Text style={styles.statValue}>Exercise</Text>
              </View>
            </View>

            <View style={styles.averageMoodCard}>
               <Text style={styles.statLabel}>Average Mood</Text>
               <View style={styles.avgMoodRow}>
                 <Text style={styles.avgEmoji}>😊</Text>
                 <Text style={styles.avgLabel}>Good</Text>
               </View>
            </View>
            
          </View>
        </ViewShot>
        
        <View style={styles.bottomActions}>
           <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
              <Text style={styles.primaryButtonText}>Share Recap</Text>
           </TouchableOpacity>
        </View>

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
  shareTextTop: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  scrollContent: {
    padding: theme.spacing.screenPadding,
    paddingBottom: 100, // Space for fixed button
  },
  recapCard: {
    backgroundColor: theme.colors.background, // Match bg so viewshot looks natural
    paddingVertical: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkinCount: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  streakBadge: {
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.pill,
    borderWidth: theme.borderWeight.default,
    borderColor: theme.colors.border,
  },
  streakText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    borderWidth: theme.borderWeight.default,
    borderColor: theme.colors.border,
    padding: 16,
    height: 200,
    marginBottom: 16,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  barColumn: {
    alignItems: 'center',
    width: 30,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 16,
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.micro.fontSize,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    borderWidth: theme.borderWeight.default,
    borderColor: theme.colors.border,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.micro.fontSize,
    marginBottom: 4,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  averageMoodCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    borderWidth: theme.borderWeight.default,
    borderColor: theme.colors.border,
    padding: 16,
    alignItems: 'center',
  },
  avgMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  avgEmoji: {
    fontSize: 32,
  },
  avgLabel: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  bottomActions: {
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: theme.colors.textPrimary,
    borderRadius: theme.borderRadius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
