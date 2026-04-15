import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { DesignTokens as t } from '../theme/tokens';
import { database } from '../database';
import MoodLog from '../database/models/MoodLog';
import DayIntention from '../database/models/DayIntention';
import { Q } from '@nozbe/watermelondb';
import { useUser, useAuth } from '@clerk/clerk-expo';

const MOOD_LABELS: Record<number, { emoji: string; label: string }> = {
  5: { emoji: '🤩', label: 'Great' },
  4: { emoji: '🙂', label: 'Good' },
  3: { emoji: '😐', label: 'Okay' },
  2: { emoji: '😞', label: 'Low' },
  1: { emoji: '😫', label: 'Rough' },
};

const INTENTION_OPTIONS: Record<string, { emoji: string; label: string }> = {
  energised: { emoji: '⚡', label: 'Energised' },
  calm:      { emoji: '😌', label: 'Calm' },
  focused:   { emoji: '🎯', label: 'Focused' },
  happy:     { emoji: '😊', label: 'Happy' },
  resilient: { emoji: '🛡️', label: 'Resilient' },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [logsToday, setLogsToday] = useState<MoodLog[]>([]);
  const [allLogs, setAllLogs] = useState<MoodLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayIntention, setTodayIntention] = useState<DayIntention | null>(null);

  // Clerk auth — gracefully handle web where Clerk may not be active
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Compute avatar initials from Clerk user data
  const avatarInitials = useMemo(() => {
    if (!user) return null;
    const first = user.firstName?.[0] ?? '';
    const last = user.lastName?.[0] ?? '';
    const initials = (first + last).toUpperCase();
    if (initials) return initials;
    // Fallback: use first letter of email
    const email = user.primaryEmailAddress?.emailAddress;
    if (email) return email[0].toUpperCase();
    return null;
  }, [user]);

  // Compute streak from all logs
  const computeStreak = useCallback((logs: MoodLog[]): number => {
    if (logs.length === 0) return 0;

    const uniqueDays = new Set(
      logs.map(log => {
        const d = new Date(log.loggedAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    );

    let streakCount = 0;
    const evalDate = new Date();
    while (true) {
      const y = evalDate.getFullYear();
      const m = String(evalDate.getMonth() + 1).padStart(2, '0');
      const d = String(evalDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      if (uniqueDays.has(dateStr)) {
        streakCount++;
        evalDate.setDate(evalDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streakCount;
  }, []);

  // Subscribe to WatermelonDB reactive queries
  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    // Today's date boundaries as timestamps
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const todayString = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    // Observe today's mood logs (reactive — UI updates when new logs are written)
    const todayLogsSubscription = database
      .get<MoodLog>('mood_logs')
      .query(
        Q.where('logged_at', Q.gte(startOfDay.getTime())),
        Q.where('logged_at', Q.lte(endOfDay.getTime())),
        Q.sortBy('logged_at', Q.desc)
      )
      .observe()
      .subscribe((logs) => {
        setLogsToday(logs);
      });

    // Observe ALL mood logs for streak computation
    const allLogsSubscription = database
      .get<MoodLog>('mood_logs')
      .query(Q.sortBy('logged_at', Q.desc))
      .observe()
      .subscribe((logs) => {
        setAllLogs(logs);
        setStreak(computeStreak(logs));
      });

    // Observe today's intention
    const intentionSubscription = database
      .get<DayIntention>('day_intentions')
      .query(Q.where('date', todayString))
      .observe()
      .subscribe((intentions) => {
        setTodayIntention(intentions.length > 0 ? intentions[0] : null);
      });

    // Cleanup subscriptions on unmount
    return () => {
      todayLogsSubscription.unsubscribe();
      allLogsSubscription.unsubscribe();
      intentionSubscription.unsubscribe();
    };
  }, [computeStreak, fadeAnim, slideAnim]);

  const handleCheckInNow = () => {
    navigation.navigate('CheckInModal');
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'good morning' : currentHour < 17 ? 'good afternoon' : 'good evening';

  const getMoodDisplay = (score: number) => MOOD_LABELS[score] || { emoji: '', label: '' };

  // Get the most recent log
  const lastLog = logsToday.length > 0 ? logsToday[0] : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Animated.View
          style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.avatarWrap, isSignedIn && styles.avatarWrapSignedIn]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {avatarInitials ?? '👤'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Sync Status Badge */}
        <Animated.View
          style={[styles.syncBadge, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.syncDot} />
          <Text style={styles.syncText}>synced</Text>
        </Animated.View>

        {/* Intention Card */}
        <Animated.View
          style={[
            styles.intentionCardWrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.card}>
            <View style={styles.intentionHeader}>
              <Text style={styles.cardSubtitle}>today's intention</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.navigate('SetIntentionModal')}
              >
                <Text style={styles.editBtnText}>edit</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.intentionContent}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SetIntentionModal')}
            >
              <Text style={styles.intentionText}>
                {todayIntention
                  ? todayIntention.targetMood
                      .split(',')
                      .filter(Boolean)
                      .map(id => `${INTENTION_OPTIONS[id]?.emoji ?? '✨'} ${INTENTION_OPTIONS[id]?.label ?? id}`)
                      .join('  ')
                  : 'Set your tone →'}
              </Text>
              <View style={styles.intentionIconWrap}>
                <Text style={styles.intentionIcon}>◎</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View
          style={[styles.statsRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={[styles.card, styles.statCard]}>
            <Text style={styles.cardSubtitle}>streak</Text>
            <Text style={styles.statValue}>
              {streak > 0 ? `${streak} days 🔥` : '0 days'}
            </Text>
            <Text style={styles.statFootnote}>personal best {streak}</Text>
          </View>

          <View style={[styles.card, styles.statCard]}>
            <Text style={styles.cardSubtitle}>today</Text>
            <Text style={styles.statValue}>{logsToday.length} checks</Text>
            <Text style={styles.statFootnote}>goal: 5</Text>
          </View>
        </Animated.View>

        {/* Last Check-in / Timeline */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={[styles.card, styles.timelineCard]}>
            <View style={styles.timelineHeader}>
              <Text style={styles.cardSubtitle}>last check-in</Text>
              <Text style={styles.timelineTime}>
                {lastLog
                  ? new Date(lastLog.loggedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'None'}
              </Text>
            </View>
            {lastLog ? (
              <View style={styles.timelineData}>
                <View style={styles.timelineMoodRow}>
                  <Text style={styles.timelineMoodEmoji}>
                    {getMoodDisplay(lastLog.moodScore).emoji}
                  </Text>
                  <Text style={styles.timelineMoodValue}>
                    {getMoodDisplay(lastLog.moodScore).label}
                  </Text>
                </View>
                <View style={styles.timelineTagRow}>
                  {lastLog.tag ? (
                    <View style={styles.tagPill}>
                      <Text style={styles.tagText}>{lastLog.tag}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              <View style={styles.emptyTimeline}>
                <Text style={styles.emptyEmoji}>👻</Text>
                <Text style={styles.emptyText}>no check-ins yet today</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCheckInNow} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>check in now</Text>
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
    paddingTop: 80,
    paddingBottom: 120, // Space for button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    color: t.colors.textPrimary,
    fontSize: t.typography.h2.fontSize,
    fontWeight: t.typography.h2.fontWeight as any,
  },
  date: {
    color: t.colors.textSecondary,
    fontSize: t.typography.body.fontSize,
    marginTop: 4,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.colors.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapSignedIn: {
    borderWidth: 2,
    borderColor: t.colors.brand,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: t.colors.brand,
    fontSize: 14,
    fontWeight: '600',
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: t.colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 24,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: t.colors.success,
    marginRight: 4,
  },
  syncText: {
    color: t.colors.success,
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  intentionCardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.borderRadius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  cardSubtitle: {
    color: t.colors.textSecondary,
    fontSize: 10,
    fontWeight: '400',
  },
  intentionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  intentionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intentionText: {
    color: t.colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  intentionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: t.colors.brandExtraLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intentionIcon: {
    color: t.colors.brand,
    fontSize: 14,
  },
  editBtnText: {
    color: t.colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  statValue: {
    color: t.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 8,
  },
  statFootnote: {
    color: t.colors.textTertiary,
    fontSize: 9,
  },
  timelineCard: {
    marginBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineTime: {
    color: t.colors.textTertiary,
    fontSize: 10,
  },
  timelineData: {
    marginTop: 4,
  },
  timelineMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timelineMoodEmoji: {
    fontSize: 28,
  },
  timelineMoodValue: {
    color: t.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  timelineTagRow: {
    flexDirection: 'row',
  },
  tagPill: {
    backgroundColor: t.colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    color: t.colors.success,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  emptyTimeline: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: t.colors.n100,
    borderRadius: t.borderRadius.sm,
    borderWidth: 0,
  },
  emptyEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  emptyText: {
    color: t.colors.textTertiary,
    fontSize: 13,
  },
  bottomBar: {
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
    paddingVertical: 16,
    borderRadius: t.borderRadius.button,
    alignItems: 'center',
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
