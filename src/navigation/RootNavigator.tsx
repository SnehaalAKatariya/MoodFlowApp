import React from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { DesignTokens as t } from '../theme/tokens';

import Splash from '../screens/Splash';
import Welcome from '../screens/onboarding/Welcome';
import Schedule from '../screens/onboarding/Schedule';
import Anchors from '../screens/onboarding/Anchors';
import Permission from '../screens/onboarding/Permission';
import Home from '../screens/Home';
import CheckInModal from '../screens/modals/CheckInModal';
import MoodShift from '../screens/modals/MoodShift';
import BreathingGuide from '../screens/modals/BreathingGuide';
import SetIntentionModal from '../screens/modals/SetIntentionModal';
import WeeklyRecap from '../screens/recap/WeeklyRecap';
import Settings from '../screens/Settings';
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Group screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBackVisible: false,
        headerLeft: ({ canGoBack }) => 
          canGoBack ? (
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={{ padding: 12, marginLeft: Platform.OS === 'ios' ? 0 : 8, marginTop: Platform.OS === 'ios' ? 0 : 16 }}
            >
              <Text style={{ fontSize: 28, color: t.colors.textPrimary, lineHeight: 28 }}>←</Text>
            </TouchableOpacity>
          ) : null
      })}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="Anchors" component={Anchors} />
        <Stack.Screen name="Permission" component={Permission} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}>
        <Stack.Screen name="CheckInModal" component={CheckInModal} />
        <Stack.Screen name="MoodShift" component={MoodShift} />
        <Stack.Screen name="SetIntentionModal" component={SetIntentionModal} />
      </Stack.Group>
      <Stack.Screen name="BreathingGuide" component={BreathingGuide} />
      <Stack.Screen name="WeeklyRecap" component={WeeklyRecap} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
