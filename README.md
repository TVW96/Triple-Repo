# MangaMagnet Monorepo

MangaMagnet is organized as a single repository with three independent app builds:

- `apps/web` → customer-facing web marketplace (Next.js)
- `apps/mobile` → mobile app (Expo + React Native)
- `apps/admin` → admin operations panel (Next.js)

## Repo structure

```text
Manga/
  apps/
    web/
    mobile/
    admin/
  packages/
    config/
    contracts/
    api-client/
    ui/
  package.json
  tsconfig.base.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- For iOS/Android native runs, local platform tooling (Xcode/Android Studio)

## Install

```bash
npm install
```

## Run each app

```bash
# Web storefront (http://localhost:3000)
npm run dev:web

# Admin panel (http://localhost:3001)
npm run dev:admin

# Mobile (Expo Dev Tools / QR)
npm run dev:mobile
```

### Login-phase preview credentials

- Web + Mobile demo user: `demo@mangamagnet.dev` / `pass123`
- Web admin demo user: `admin@mangamagnet.dev` / `admin123`

### What you can preview right now

- Web:
  - `/` login page
  - `/market` guarded route (redirects to login when session is missing)
  - mocked listing + wallet rendering after login
- Mobile:
  - guarded login screen
  - invalid-credential error handling
  - post-login wallet state rendering

## Build each target

```bash
npm run build:web
npm run build:admin
npm run build:mobile
```

## Frontend testing (now available)

You can run frontend tests today for both web and mobile:

```bash
# Web UI tests (Vitest + Testing Library)
npm run test:web

# Mobile UI tests (Jest + React Native Testing Library)
npm run test:mobile

# Run both
npm run test:frontend
```

Shared package tests still run with:

```bash
npm run test:shared
```

## Visual preview workflows

Use these to view how the app looks while building features:

```bash
# Web storefront preview
npm run dev:web

# Admin panel preview
npm run dev:admin

# Mobile preview (Expo Go / simulator / web)
npm run dev:mobile
```

## Feature testing rollout plan

Current status:

- ✅ Web and mobile frontend test harnesses are wired and passing.
- ✅ Shared API mock patterns are in place for deterministic UI tests.

Next phases for your requested flows:

1. **Auth (login/logout/session guard)**

- Add shared auth state module and mock auth provider
- Add tests for login form validation, success, and invalid credentials

2. **Listing flows (create/edit/delete/search listings)**

- Add listing form UI in web/mobile
- Add tests for field validation, submit behavior, and list refresh

3. **Buy/Sell order flows**

- Add checkout actions and order state transitions
- Add tests for pending/paid/fulfilled/cancelled scenarios

4. **Coin wallet + purchase flows**

- Add top-up UI (Stripe/IAP mock path first)
- Add tests for balance update, insufficient funds, and purchase failures

5. **Cross-app E2E layer**

- Add browser-level E2E for key web journeys
- Add device-level smoke flows for mobile (Expo-managed compatible approach)

## Shared packages

The monorepo now includes shared workspace packages for cross-app reuse:

- `@mangamagnet/config` → environment + app-level config defaults
- `@mangamagnet/contracts` → shared API path constants and domain enums
- `@mangamagnet/api-client` → lightweight API client factory (`createApiClient`)
- `@mangamagnet/ui` → cross-platform design tokens (web CSS vars + React Native token bridge)

Validate shared exports from the root:

```bash
npm run check:shared
```

Run all current tests from the root:

```bash
# web + mobile frontend tests
npm run test:frontend

# shared package tests
npm run test:shared
```

These packages are scaffolded and ready to be imported by `web`, `admin`, and `mobile` as features are implemented.

## Notes

- `web` and `admin` are intentionally separate builds to allow independent deployments.
- `mobile` uses Expo for faster cross-platform iteration.
- The architecture aligns with your provided 3-tier platform model, with separate presentation apps feeding shared backend services.

## Suggested next implementation steps

1. Add listing creation/edit flows (seller) with optimistic UI + tests.
2. Add buy/sell transaction screens with order state transitions and tests.
3. Add coin purchase UI (Stripe/IAP mock adapters first, real gateway wiring second).
4. Add auth token refresh + persisted sessions (web storage and secure mobile storage).

If you want, I can now scaffold the backend gateway + service skeleton in the same monorepo so it matches your full platform diagram end-to-end.
# Triple-Repo
