# Swifty Companion

A mobile app (Expo / React Native / TypeScript) that searches a 42 intra
login and displays that student's public profile: details, skills, and
completed projects. Mandatory part only.

## Architecture

- `backend/` — a minimal Express + TypeScript server. It holds the 42
  API `client_id`/`client_secret`, obtains an access token via the
  OAuth2 Client Credentials grant (fetched once, cached, reused for
  every request — never re-created per query), and exposes a single
  proxy endpoint: `GET /api/users/:login`.
- `app/` — the Expo (React Native + TypeScript) mobile app. It never
  handles OAuth or holds any secret; it only calls the backend above.

This split exists because a mobile app bundle can always be
decompiled, so a `client_secret` embedded in it can never truly stay
hidden. Keeping the secret only in the backend's `.env` is the only
way to guarantee it never ships inside the app.

## Setup

Run the backend and the mobile app in two separate terminals (the
Expo dev server needs its own real terminal to show the QR code and
handle key presses like `i`/`a`).

### 1. Register a 42 API application

Go to https://profile.intra.42.fr/oauth/applications and create a new
application:

- **Application type**: `42 Pedagogical Project`
- **Redirect URI**: any valid URI works (e.g. `http://localhost`) —
  it's unused by the Client Credentials grant
- **Scopes**: `Access the user public data` only

Note the **UID** and **SECRET** it gives you.

### 2. Backend

```sh
cd backend
cp .env.example .env
# edit .env: set FT_CLIENT_UID and FT_CLIENT_SECRET
npm install
npm run dev
```

The server listens on `http://localhost:3000` by default.

### 3. Mobile app

```sh
cd app
cp .env.example .env
# edit .env: set EXPO_PUBLIC_API_BASE_URL to the backend's address.
# On a physical device via Expo Go, "localhost" refers to the device
# itself, so use your computer's LAN IP instead, e.g.
# http://192.168.1.23:3000
npm install
npm start
```

Then open the app in Expo Go (or a simulator) from the QR code /
menu that `npm start` prints.

## Notes

- Token refresh on expiration (bonus) is not implemented — the
  backend fetches its token once and reuses it for the lifetime of
  the process.

## References

- 42 API documentation (requires a logged-in 42 intra session): https://api.intra.42.fr/apidoc
- 42 API getting started guide: https://api.intra.42.fr/apidoc/guides/getting_started
