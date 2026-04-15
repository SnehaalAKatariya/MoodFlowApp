# MoodFlow App

MoodFlow is a React Native mobile application built with Expo for tracking your moods, setting daily intentions, and cultivating better mental habits.

## 🚀 Features

- **Offline-First Data**: Uses [WatermelonDB](https://watermelondb.dev/) to ensure your mood data is always accessible and saved securely, even without an internet connection.
- **Hourly Check-ins**: Setup personalized check-in schedules directly during onboarding so the app aligns with your natural waking hours.
- **Set Intentions**: Choose from a predefined set of daily intentions (Energised, Calm, Focused, Happy, Resilient) to guide your day.
- **Clean UI**: Beautiful, lightweight design aesthetic.

## 🛠 Tech Stack

- **Framework:** React Native / Expo
- **Database:** WatermelonDB (Offline-first data persistence)
- **State Management:** Zustand
- **Authentication:** Clerk
- **Routing:** React Navigation

## 📦 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo server:**
   ```bash
   npx expo start
   ```

3. **Run on a device:**
   - Press `a` to open in Android emulator
   - Press `i` to open in iOS simulator
   - Press `w` to open in a web browser
   - Or scan the QR code with the Expo Go app on your physical device!
