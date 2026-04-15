# MoodFlow — Application Architecture & Flow

> **Version:** 1.0 MVP  
> **Stack:** React Native + Expo · Clerk Auth · WatermelonDB + AsyncStorage · Zustand

---

## 1. Project Structure

```
MoodFlowApp/
├── App.tsx                     # Root: ClerkProvider + NavigationContainer
├── index.ts                    # Expo entry point
├── babel.config.js             # Decorator support for WatermelonDB
├── .env                        # EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
│
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx   # NativeStack navigator, all screen registrations
    │   └── types.ts            # RootStackParamList — typed route params
    │
    ├── theme/
    │   └── tokens.ts           # Design system: colors, typography, spacing, radii
    │
    ├── store/
    │   └── index.ts            # Zustand store — onboarding transient state
    │
    ├── database/
    │   ├── index.ts            # Database factory (LokiJS on web, SQLite on native)
    │   ├── schema.ts           # WatermelonDB schema (users, mood_logs, day_intentions)
    │   └── models/
    │       ├── User.ts
    │       ├── MoodLog.ts
    │       └── DayIntention.ts
    │
    └── screens/
        ├── Splash.tsx
        ├── Home.tsx
        ├── Settings.tsx
        ├── auth/
        │   ├── Login.tsx
        │   └── Signup.tsx
        ├── onboarding/
        │   ├── Welcome.tsx
        │   ├── Schedule.tsx
        │   ├── Anchors.tsx
        │   └── Permission.tsx
        ├── modals/
        │   ├── CheckInModal.tsx
        │   ├── MoodShift.tsx
        │   ├── BreathingGuide.tsx
        │   └── SetIntentionModal.tsx
        └── recap/
            └── WeeklyRecap.tsx
```

---

## 2. Navigation Architecture

All screens live in a single flat **NativeStack** (`RootNavigator.tsx`). There is no nested tab navigator in this MVP.

```
Splash
  └─▶ Welcome
         ├─▶ Login  ──────────────── ─▶ Home
         └─▶ Signup ─▶ Schedule
                         └─▶ Anchors
                               └─▶ Permission ─▶ Home

Home  ─▶  CheckInModal (transparentModal)
      ─▶  MoodShift    (transparentModal, auto-triggered on mood ≤ 2)
      ─▶  Anchors      (update daily intention)
      ─▶  Settings
      ─▶  WeeklyRecap
      ─▶  BreathingGuide
```

### Screen Groups

| Group | Config | Screens |
|---|---|---|
| Default | `headerShown: false, animation: fade` | Splash, Welcome |
| Auth/Onboarding | `headerShown: true, headerTransparent, ← back button` | Login, Signup, Schedule, Anchors, Permission, Home |
| Modals | `presentation: transparentModal, slide_from_bottom` | CheckInModal, MoodShift, SetIntentionModal |
| Standalone | default | BreathingGuide, WeeklyRecap, Settings |

---

## 3. Authentication Flow

Authentication is handled by **Clerk** (`@clerk/clerk-expo`) on native builds. The web preview bypasses Clerk for UI testing.

```
App.tsx wraps everything in <ClerkProvider>
         tokenCache = expo-secure-store (native only, undefined on web)

Splash
  ├── useAuth().isSignedIn === true  ──▶  Home  (stack reset, no back)
  └── isSignedIn === false           ──▶  Welcome

Welcome  ──▶  Login / Signup / (Skip to Schedule for anonymous)

Login
  ├── Web:    Platform.OS === 'web'  ──▶  directly reset stack to Home
  └── Native: useSignIn().signIn.create() → setActive() → reset to Home

Signup
  ├── Web:    Platform.OS === 'web'  ──▶  directly reset stack to Schedule
  └── Native: useSignUp().signUp.create()
               → prepareEmailAddressVerification()
               → attemptEmailAddressVerification()
               → setActive() → navigate to Schedule

Settings
  └── Log Out: useAuth().signOut() → navigation.reset to Welcome
```

> **Note:** `useAuth().isSignedIn` guards on Welcome, Login, and Signup screens — authenticated users are redirected to Home automatically via `useEffect`.

---

## 4. Data Architecture

MoodFlow uses a **dual-layer storage** strategy:

| Layer | Technology | Used For |
|---|---|---|
| **Primary persistence** | `AsyncStorage` | Mood logs, today's intention, daily reset |
| **Structured DB** | `WatermelonDB` | Schema-validated records (Users, MoodLogs, DayIntentions) |
| **Transient state** | `Zustand` | Onboarding wizard state (wakeTime, sleepTime, interval, anchors) |

### Why Dual Layer?

WatermelonDB's LokiJS web adapter had unresolvable `Promise`-hang issues during development. `AsyncStorage` is used as the **reliable cross-platform operation layer** while WatermelonDB remains in the schema and is the intended production target for native builds.

### WatermelonDB Schema

```
users
  supabase_id (string, optional)
  wake_time, sleep_time (string: "07:00")
  check_in_interval_h (number: 1 | 2 | 3)
  timezone (string: IANA)
  anchor_moods (string: JSON array stringified)
  onboarding_done (boolean)

mood_logs
  user_id (string)
  mood_score (number: 1–5)
  tag (string, optional: work|sleep|food|social|exercise)
  logged_at (number: Unix timestamp ms)
  source (string: manual|notification|morning_intention)
  follow_up_score (number, optional)
  synced (boolean)

day_intentions
  user_id (string)
  target_mood (string)
  date (string: YYYY-MM-DD)
  playlist_id (string, optional)
  synced (boolean)
```

### AsyncStorage Keys

| Key | Value | Resets |
|---|---|---|
| `mood_logs` | `JSON[]` of `StoredMoodLog` — all time | Never (append-only) |
| `intention_YYYY-MM-DD` | `JSON[]` of anchor IDs | Automatically — key includes date |

---

## 5. Core User Flows

### 5.1 Onboarding (First Time)

```
Splash → Welcome → Signup
  └─▶ Schedule     (wake/sleep time + 1h/2h/3h/custom interval)
       └─▶ Anchors     (select anchor moods for today: 1–3 picks)
            └─▶ Permission   (request Expo Notifications)
                 └─▶ Home
```

Onboarding state is held in **Zustand** (`useOnboardingStore`):
- `wakeTime`, `sleepTime`, `checkInIntervalHours`
- `anchorMoods[]`

> ⚠️ **Known gap:** These values are not yet persisted to WatermelonDB `users` table on `handleContinue`. This is a Phase 2 task.

---

### 5.2 Daily Check-In Loop

```
Home  ──▶  CheckInModal (bottom sheet, transparentModal)
              │
              ├─ Select mood emoji (1=Rough … 5=Great)
              ├─ Optional: tag (work / sleep / food / social / exercise)
              └─ Save
                   │
                   ├── AsyncStorage.setItem('mood_logs', [...])
                   │
                   ├── moodScore ≤ 2  ──▶  MoodShift screen
                   └── moodScore > 2  ──▶  navigation.goBack() → Home
```

On return to Home, `useFocusEffect` triggers `loadLogs()` which re-reads `AsyncStorage` and updates:
- **Last check-in card** (mood label + tag)
- **Today count** stat card
- **Streak** counter (consecutive days with at least 1 log)

---

### 5.3 Today's Intention Flow

```
Home  ──▶  Anchors screen  (via "edit" button or tapping intention card)
              │
              ├─ Load today's key: intention_YYYY-MM-DD from AsyncStorage
              ├─ Select 1–3 anchor moods (disabled when 3 already chosen)
              └─ Set Intention
                   │
                   └── AsyncStorage.setItem(`intention_${today}`, [...ids])
                        └── navigation.goBack() → Home
```

On Home, `useFocusEffect` reloads `intention_YYYY-MM-DD`. Tomorrow's key is different, so intention **auto-resets daily** with zero extra code.

The Anchors screen also supports the **onboarding path** (`Continue →` button) by detecting whether the `Schedule` route exists in the navigation state.

---

### 5.4 Mood-Shift Flow (Low / Rough)

```
CheckInModal (score ≤ 2)
  └─▶ MoodShift screen
         ├─▶ "Listen" ──▶ Spotify deep-link (Linking.openURL)
         └─▶ "Breathe" ──▶ BreathingGuide (4-7-8 timer, offline)
```

`MoodShift.tsx` uses `React Native Linking` to open `spotify:playlist:...` URIs. If Spotify isn't installed, falls back to a YouTube Music URL.

---

### 5.5 Settings & Logout

```
Settings
  ├── Shows user email or "Anonymous"
  ├── Log Out button (when isSignedIn)
  │     └── signOut() → navigation.reset to Welcome
  └── Sign In link (when not signed in) → navigates to Login
```

---

## 6. Design System

All visual tokens live in `src/theme/tokens.ts`.

| Token Group | Key Values |
|---|---|
| **Colors** | `brand` (#5D5FEF), `background` (#FAFAFA), `surface` (#FFFFFF), `n100–n900` neutral scale |
| **Typography** | `h1` (20/700), `h2` (17/600), `body` (14/400), `micro` (11/400) |
| **Spacing** | `padding: 20` |
| **Border Radius** | `button: 12`, `card: 16`, `mood: 12`, `sm: 8`, `md: 12` |

---

## 7. What Is Built vs. Stubbed

### ✅ Complete
- Authentication (Clerk — native) / web bypass
- Splash auto-redirect based on auth state
- Onboarding wizard UI (Schedule, Anchors, Permission)
- Daily check-in with mood + tag → AsyncStorage
- Home feed: greeting, streak, today count, last check-in, intention card
- Today's intention (Anchors) — daily key, 1–3 selection, auto-reset
- Mood-shift flow (MoodShift → Spotify / BreathingGuide)
- Settings with Logout
- Back navigation on all screens

### 🟧 Stubbed / Incomplete
| Feature | Status |
|---|---|
| Onboarding data → WatermelonDB `users` table | UI done, DB write missing |
| Push notification scheduling | Permission granted, no Expo schedule logic |
| Weekly Recap calculations | Screen exists, data queries not wired |
| Shareable Recap Card | `react-native-view-shot` installed, not connected |
| Follow-up nudge (5 min after mood-shift) | Not implemented |

---

## 8. Key Dependencies

| Package | Role |
|---|---|
| `expo` | Cross-platform native/web runtime |
| `@clerk/clerk-expo` | Authentication (native iOS/Android) |
| `@react-navigation/native-stack` | Stack navigation |
| `@nozbe/watermelondb` | Offline-first relational database |
| `@react-native-async-storage/async-storage` | Lightweight key-value persistence (cross-platform) |
| `zustand` | Lightweight global state (onboarding wizard) |
| `expo-notifications` | Local push notification scheduling |
| `expo-secure-store` | Clerk token cache on native |
| `react-native-view-shot` | Weekly recap card screenshot (pending) |
