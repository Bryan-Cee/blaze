<p align="center">
  <img src="assets/icon.png" alt="Blaze" width="120" height="120" />
</p>

<h1 align="center">Blaze</h1>

<p align="center">
  An 8-week fat loss companion app built with React Native and Expo. Blaze helps you execute a structured nutrition, training, hydration, and recovery plan to lose 5kg in 8 weeks.
</p>

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-54-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Dashboard
- Daily overview with weight progress ring and start/current/goal metrics
- Today's workout card with quick access
- Hydration tracker with quick-add buttons (250ml, 500ml, 750ml) and undo
- Calories and macro summary

### Training
- 5-day weekly workout schedule:
  - **Monday:** Strength A - Upper Push/Pull
  - **Tuesday:** Zone 2 Cardio + Mobility
  - **Wednesday:** Strength B - Lower Body + Core
  - **Thursday:** HIIT / MetCon Intervals
  - **Friday:** Strength C - Full Body Volume
  - **Sat/Sun:** Rest days
- Exercise checklists with warm-up, main lifts, accessories, and finisher
- 45-minute workout timer
- HIIT interval timer (10 rounds of 40s work / 20s rest)
- RPE logging and workout notes

### Nutrition
- Daily calorie and macro targets (protein, carbs, fat)
- Sample meal plan with detailed macros
- Meal prep checklist (Sunday + Wednesday refresh)
- Grocery list organized by category

### Hydration & Recovery
- Water intake tracking with daily goals (3L default)
- Hydration streaks and history
- Biofeedback logging (energy, hunger, sleep quality)
- Recovery checklist (sleep, wind-down, mobility, etc.)

### Progress
- Weight tracking with visual charts
- Expected vs actual weight trajectory
- Body measurements (waist, hip, chest)
- Progress photo capture and gallery
- Weekly summary with adherence stats

### Knowledge Base
- Glossary (NEAT, Zone 2, RPE, macros, etc.)
- Tips for habit stacking, nutrition, and recovery
- FAQ for common questions (plateaus, alcohol, cheat meals)

### Notifications
- Local push notifications via `expo-notifications`
- Workout reminders (Mon–Fri at 6:45 AM)
- Hydration reminders (every 90 min, 8 AM – 6:30 PM)
- Meal prep reminders (Sunday 5 PM, Wednesday 6 PM)
- Weekly check-in reminder (Monday 7:30 AM)
- Toggle individual reminder types on/off
- Graceful fallback in Expo Go (notifications require a development build)

### Settings
- Profile and goal customization
- Reminder preferences with live notification scheduling
- Data export (JSON/CSV)
- Full data reset across all stores

## Tech Stack

- **Framework:** React Native 0.81 with Expo SDK 54
- **Language:** TypeScript
- **State Management:** Zustand with AsyncStorage persistence
- **Navigation:** React Navigation (bottom tabs + stack navigators)
- **Notifications:** expo-notifications (local scheduling)
- **Charts:** React Native Chart Kit
- **Forms:** React Hook Form
- **Icons:** Ionicons via @expo/vector-icons
- **Date Utilities:** date-fns
- **Styling:** Strava-inspired dark theme

## Design

The app uses a Strava-inspired design language:
- **Background:** Charcoal (#111418)
- **Primary Accent:** Orange (#f15c22)
- **Secondary Accent:** Teal (#1f8ac0)
- **Typography:** Bold, metric-focused with large numerals

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/Bryan-Cee/blaze.git
cd blaze

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

```bash
# Start Expo dev server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on web (limited support)
npx expo start --web
```

## Project Structure

```
src/
├── components/
│   └── common/          # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── MetricTile.tsx
│       ├── ProgressRing.tsx
│       └── Slider.tsx
├── data/                # Static content
│   ├── knowledge.ts     # Glossary, tips, FAQs
│   ├── nutrition.ts     # Meal plans, grocery lists
│   └── workouts.ts      # Workout definitions
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── MainTabNavigator.tsx
│   └── stacks/          # Stack navigators per tab
├── screens/             # Screen components
│   ├── home/
│   ├── hydration/
│   ├── knowledge/
│   ├── nutrition/
│   ├── onboarding/
│   ├── progress/
│   ├── settings/
│   └── workouts/
├── services/            # Background services
│   └── notificationService.ts
├── store/               # Zustand stores
│   ├── hydrationStore.ts
│   ├── nutritionStore.ts
│   ├── progressStore.ts
│   ├── userStore.ts
│   └── workoutStore.ts
├── theme/               # Design tokens
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
└── types/               # TypeScript interfaces
    └── index.ts
```

## Notes

- **Notifications** require a [development build](https://docs.expo.dev/develop/development-builds/introduction/) to function. In Expo Go, the notification service degrades gracefully (no crashes, but no notifications).
- **Progress photos** use `expo-image-picker` and require camera/photo library permissions.

## Data Privacy

All data is stored locally on your device using AsyncStorage. No accounts required, no cloud sync, no data leaves your device.

## License

MIT License - feel free to use this for your own fitness journey!

## Acknowledgments

- Design inspired by [Strava](https://www.strava.com/)
- Built with [Expo](https://expo.dev/)
- State management by [Zustand](https://github.com/pmndrs/zustand)
