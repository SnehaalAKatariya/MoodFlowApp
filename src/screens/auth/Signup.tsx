import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { DesignTokens as t } from '../../theme/tokens';
import { useSignUp, useAuth } from '@clerk/clerk-expo';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function Signup({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [isSignedIn]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSignUp = async () => {
    // Clerk does not support web — skip auth in web preview
    if (Platform.OS === 'web') {
      navigation.reset({ index: 0, routes: [{ name: 'Schedule' }] });
      return;
    }
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign-up Error:', err);
      Alert.alert("Sign up failed", err.errors[0]?.message || 'An error occurred');
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        navigation.navigate('Schedule'); // Go to onboarding
      } else {
        console.warn('Sign-up Needs Further Steps', completeSignUp);
      }
    } catch (err: any) {
      console.error('Verification Error:', err);
      Alert.alert("Verification failed", err.errors[0]?.message || 'Invalid code');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={{ 
        flex: 1, 
        justifyContent: 'center',
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}>
        
        <View style={styles.headerContainer}>
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>M</Text>
          </View>
          <Text style={styles.title}>Create your space</Text>
          <Text style={styles.subtitle}>
            {pendingVerification ? 'Enter the code sent to your email' : 'Sign up to sync your mood data safely'}
          </Text>
        </View>

        {!pendingVerification && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={t.colors.n400}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={t.colors.n400}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        )}

        {pendingVerification && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor={t.colors.n400}
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            activeOpacity={0.8}
            onPress={pendingVerification ? handleVerify : handleSignUp}
          >
            <Text style={styles.primaryBtnText}>
              {pendingVerification ? 'Verify & Continue' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          
        </View>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: t.spacing.padding,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: t.colors.brandLight,
    borderWidth: 1.5,
    borderColor: t.colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    color: t.colors.brand,
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    fontSize: t.typography.h1.fontSize,
    fontWeight: '700',
    color: t.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: t.typography.body.fontSize,
    color: t.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  formContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: t.typography.bodyBold.fontSize,
    fontWeight: '600',
    color: t.colors.textPrimary,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: t.colors.surface,
    height: 56,
    borderRadius: t.borderRadius.md,
    borderWidth: t.borderWeight.default,
    borderColor: t.colors.n200,
    paddingHorizontal: 16,
    fontSize: 16,
    color: t.colors.textPrimary,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: t.colors.brand,
    height: 52,
    borderRadius: t.borderRadius.button,
    justifyContent: 'center',
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
  secondaryBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: t.colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  }
});
