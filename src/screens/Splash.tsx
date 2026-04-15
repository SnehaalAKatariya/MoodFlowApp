import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { DesignTokens as t } from '../theme/tokens';
import { database } from '../database';
import User from '../database/models/User';
import { useAuth } from '@clerk/clerk-expo';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function Splash({ navigation }: Props) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // 1. Kick off UI animations
    Animated.sequence([
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(progressAnim, { toValue: 1, duration: 1000, useNativeDriver: false }) // false because we animate width
    ]).start();

    // 2. Database check & Routing
    const initializeApp = async () => {
      // Must wait for Clerk to load
      if (!isLoaded) return;

      try {
        // We still init/check local DB just in case, but auth state is king
        const usersCollection = database.collections.get<User>('users');
        const users = await usersCollection.query().fetch();
        
        let path: 'Home' | 'Welcome' = 'Welcome';
        
        if (isSignedIn) {
          path = 'Home';
        } else {
          path = 'Welcome';
        }
        
        // Let the progress bar animation finish for visual polish before navigating
        setTimeout(() => {
          navigation.replace(path);
        }, 1500);

      } catch (error) {
        console.error('Failed to initialize local database on Splash:', error);
        // Fallback
        setTimeout(() => {
          navigation.replace('Welcome');
        }, 1500);
      }
    };

    initializeApp();
  }, [navigation, logoAnim, contentAnim, progressAnim, isLoaded, isSignedIn]);

  // Interpolate progress to width percentage
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.logoWrapper, { 
          opacity: logoAnim, 
          transform: [{ scale: logoAnim }] 
        }]}
      >
        <Text style={styles.logoText}>M</Text>
      </Animated.View>

      <Animated.View 
        style={{ 
          alignItems: 'center',
          opacity: contentAnim, 
          transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] 
        }}
      >
        <Text style={styles.brand}>MoodFlow</Text>
        <Text style={styles.subtext}>how are you, really?</Text>
      </Animated.View>

      <Animated.View style={[styles.progressContainer, { opacity: contentAnim }]}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.status}>setting up your space…</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: t.colors.brandLight,
    borderWidth: 1.5,
    borderColor: t.colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: t.colors.brand,
    fontSize: 16,
    fontWeight: '700',
  },
  brand: {
    color: t.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtext: {
    color: t.colors.textSecondary,
    fontSize: 13,
    fontWeight: '400',
  },
  progressContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  progressBarBg: {
    width: 120,
    height: 3,
    backgroundColor: t.colors.n200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: t.colors.brand,
    borderRadius: 2,
  },
  status: {
    color: t.colors.n400,
    fontSize: 11,
    marginTop: 12,
  }
});
