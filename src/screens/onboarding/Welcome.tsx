import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens as t } from '../../theme/tokens';
import { useAuth } from '@clerk/clerk-expo';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function Welcome({ navigation }: Props) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const btn1Anim = useRef(new Animated.Value(0)).current;
  const btn2Anim = useRef(new Animated.Value(0)).current;

  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      return;
    }

    Animated.sequence([
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(btn1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(btn2Anim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      {/* 
        To center vertically but offset slightly top, 
        we can use a top padding and let the content push down. 
      */}
      <View style={styles.content}>
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
            opacity: contentAnim, 
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] 
          }}
        >
          <Text style={styles.headline}>understand how</Text>
          <Text style={[styles.headline, styles.headlineMargin]}>you feel, hourly</Text>

          <Text style={styles.subtext}>5-second check-ins. a playlist when</Text>
          <Text style={styles.subtext}>you dip. a weekly picture of your</Text>
          <Text style={styles.subtext}>emotional life.</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Animated.View style={{ opacity: btn1Anim }}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.primaryBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: btn2Anim }}>
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryBtnText}>Log In</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => navigation.navigate('Schedule')}
          style={{ paddingVertical: 12 }}
        >
          <Text style={styles.micro}>Continue anonymously</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: t.spacing.padding,
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: '35%',
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
    alignSelf: 'center',
    marginBottom: 64,
  },
  logoText: {
    color: t.colors.brand,
    fontSize: 16,
    fontWeight: '700',
  },
  headline: {
    color: t.colors.textPrimary,
    fontSize: t.typography.h1.fontSize,
    fontWeight: t.typography.h1.fontWeight as any,
    lineHeight: 34,
  },
  headlineMargin: {
    marginBottom: 40,
  },
  subtext: {
    color: t.colors.textSecondary,
    fontSize: t.typography.bodyBold.fontSize,
    fontWeight: '400', // matches web non-bold base
    marginBottom: 4,
  },
  footer: {
    paddingBottom: 40,
  },
  primaryBtn: {
    backgroundColor: t.colors.brand,
    height: 52,
    borderRadius: t.borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: t.colors.surface,
    height: 48,
    borderRadius: t.borderRadius.button,
    borderWidth: 1,
    borderColor: t.colors.n300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryBtnText: {
    color: t.colors.n700,
    fontSize: 15,
    fontWeight: '500',
  },
  micro: {
    color: t.colors.n400,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  }
});
