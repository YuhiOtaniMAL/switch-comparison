# Swifty Companion (Mandatory Part)

This repository contains a mobile app (Expo + React Native + TypeScript) for querying 42 student profiles with the 42 API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your API credentials:
   - `EXPO_PUBLIC_UID`
   - `EXPO_PUBLIC_SECRET`
3. Start the app:
   ```bash
   npm start
   ```

## Scope implemented

- Mandatory requirements implemented (2 views, error handling, profile details, skills, completed projects including failed ones, back navigation, flexible layout, OAuth2 token reuse).
- Bonus token refresh on expiration is intentionally not implemented.