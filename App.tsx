import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Platform, View, StyleSheet } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { DesignTokens as t } from './src/theme/tokens';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = Platform.OS === 'web' ? undefined : {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used \uD83D\uDD10 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: t.colors.background,
    card: t.colors.surface,
    text: t.colors.textPrimary,
    border: t.colors.border,
    primary: t.colors.brand,
  },
};

export default function App() {
  const isWeb = Platform.OS === 'web';

  const content = (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <NavigationContainer theme={LightTheme}>
        <RootNavigator />
      </NavigationContainer>
    </ClerkProvider>
  );

  if (isWeb) {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.webAppContainer}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: t.colors.n100, // Light grey background for the desktop wrapper
    alignItems: 'center',
    justifyContent: 'center',
  },
  webAppContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 414,      // iPhone Pro Max width
    maxHeight: 896,     // iPhone Pro Max height
    overflow: 'hidden',
    backgroundColor: t.colors.background,
    borderRadius: 32,   // Phone corner radius
    borderWidth: 8,
    borderColor: t.colors.n800, // Black phone bezel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
  }
});
