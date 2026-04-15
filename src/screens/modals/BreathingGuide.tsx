import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens } from '../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'BreathingGuide'>;

export default function BreathingGuide({ navigation }: Props) {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [scale] = useState(new Animated.Value(0.5));

  useEffect(() => {
    runBreathingCycle();
  }, []);

  const runBreathingCycle = () => {
    // 4-7-8 Breathing Technique
    // Inhale: 4s (Grow)
    setPhase('Inhale');
    Animated.timing(scale, {
      toValue: 1,
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Hold: 7s (Stay large)
      setPhase('Hold');
      setTimeout(() => {
        // Exhale: 8s (Shrink)
        setPhase('Exhale');
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          // Loop
          runBreathingCycle();
        });
      }, 7000);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>4-7-8 Breathing</Text>
      
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
        <Text style={styles.phaseText}>{phase}</Text>
      </View>

      <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.doneBtnText}>I feel better</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
    alignItems: 'center',
    padding: DesignTokens.spacing.padding,
    paddingTop: 80,
  },
  title: {
    ...DesignTokens.typography.h1,
    fontSize: 24,
    marginBottom: 60,
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: `${DesignTokens.colors.primary}40`,
    position: 'absolute',
  },
  phaseText: {
    ...DesignTokens.typography.h1,
    fontSize: 32,
    color: DesignTokens.colors.primary,
  },
  doneBtn: {
    backgroundColor: DesignTokens.colors.buttonPrimary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: DesignTokens.borderRadius.button,
    marginBottom: 40,
  },
  doneBtnText: {
    ...DesignTokens.typography.h1,
    fontSize: 16,
  },
});
