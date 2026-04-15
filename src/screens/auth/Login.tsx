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
import { useSignIn, useAuth } from '@clerk/clerk-expo';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const { signIn, setActive, isLoaded } = useSignIn();
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

  const handleLogin = async () => {
    // Clerk does not support web — skip auth in web preview
    if (Platform.OS === 'web') {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      return;
    }
    if (!isLoaded) return;
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        console.warn('Sign-in Needs Further Steps', completeSignIn);
      }
    } catch (err: any) {
      console.error('Sign-in Error:', err);
      Alert.alert("Log In Failed", err.errors?.[0]?.message || 'Please check your credentials and try again.');
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Enter your details to continue</Text>
        </View>

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
          
          <TouchableOpacity activeOpacity={0.7} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.primaryBtnText}>Log In</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: t.colors.brand,
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
