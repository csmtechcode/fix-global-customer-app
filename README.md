# Fix Global Customer App

A React Native customer-facing app built with Expo Router, TypeScript, and a custom global theme and language context.

## Features

- File-based routing with Expo Router
- Global light/dark theme support
- Language selection inside the app
- Profile, settings, notifications, wallet, search, and bookings screens
- Reusable `TopBar` and `Navbar` components with theme-aware styling
- Safe area support via `react-native-safe-area-context`

## Development

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Open the app in:

- Android emulator
- iOS simulator
- Expo Go on a physical device

## App structure

- `app/` – Expo Router entrypoints and screens
- `src/components/` – shared UI and layout components
- `src/context/ThemeContext.tsx` – global theme and language provider
- `src/hooks/` – reusable custom hooks
- `src/lib/` – helpers, API wrappers, storage, and validators

## Theme and language

- Dark mode toggle lives in `app/(tabs)/settings.tsx`
- Language selector is also available on the settings screen
- `ThemeContext` provides `themeMode`, `language`, `colors`, and helpers
- Shared layout components use theme colors for consistent styling

## Notes

This project is intended as a customer app prototype with an emphasis on UI polish, navigation flow, and accessibility for theming.
