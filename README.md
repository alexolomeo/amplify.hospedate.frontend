# Local Airbnb

A web application built using **Astro Framework**, with React, Daisy UI and Tailwind CSS.

## Technologies

- Astro + React
- Tailwind CSS
- Daisy UI

## Requeriments

- Node v22.12+

## Project Setup

### Install dependencies

`npm install`

### Setup Husky

`npm prepare`

### Access the application

Execute `npm run dev` and then visit http://localhost:4321.

## Firebase Cloud Messaging (FCM) Setup

This project includes Firebase Cloud Messaging for push notifications. To set up FCM:

### 1. Environment Configuration

Make sure your `.env` file contains the required Firebase configuration variables:

```bash
PUBLIC_ENABLE_WEB_PUSH=true
PUBLIC_FIREBASE_API_KEY='your-firebase-api-key'
PUBLIC_FIREBASE_AUTH_DOMAIN='your-project.firebaseapp.com'
PUBLIC_FIREBASE_PROJECT_ID='your-project-id'
PUBLIC_FIREBASE_STORAGE_BUCKET='your-project.firebasestorage.app'
PUBLIC_FIREBASE_MESSAGING_SENDER_ID='your-sender-id'
PUBLIC_FIREBASE_APP_ID='your-app-id'
PUBLIC_FIREBASE_MEASUREMENT_ID='G-your-measurement-id'
PUBLIC_FIREBASE_VAPID_KEY='your-vapid-key'
```

### 2. Generate Service Worker

Before running the application, you must generate the Firebase messaging service worker:

```bash
npm run prebuild
```

This script:

- Reads your Firebase configuration from environment variables
- Generates the `public/firebase-messaging-sw.js` file from the template
- Injects your Firebase config into the service worker

⚠️ **Important**: Run `npm run prebuild` whenever you:

- Set up the project for the first time
- Change Firebase environment variables
- Deploy to a new environment

### 3. Testing FCM

To test push notifications:

1. Run the application: `npm run dev`
2. Log in to your account (FCM initializes only when logged in)
3. Allow notification permissions when prompted
4. Check browser console for your FCM registration token
5. Use Firebase Console to send test notifications

## Commands

All commands are run from the root of the project, from a terminal:

| Command                 | Action                                         |
| :---------------------- | :--------------------------------------------- |
| `npm install`           | Installs dependencies                          |
| `npm run dev`           | Starts local dev server at `localhost:4321`    |
| `npm run prebuild`      | Generates Firebase service worker for FCM      |
| `npm run build`         | Build your production site to `./dist/`        |
| `npm run preview`       | Preview your build locally, before deploying   |
| `npm run format`        | Format the code using prettier                 |
| `npm run prepare`       | Prepare the project to use Husky               |
| `npm run lintstaged`    | Execute lint validations over the staged files |
| `npm run commitlint`    | Validates that commits follow the conventions  |
| `npm run release`       | Create a new release (automatic version bump)  |
| `npm run release:patch` | Create a patch release (0.0.X)                 |
| `npm run release:minor` | Create a minor release (0.X.0)                 |
| `npm run release:major` | Create a major release (X.0.0)                 |
| `npm run release:dry`   | Preview what a release would do                |
| `./scripts/release.sh`  | Interactive release process with guided steps  |

## Release Process

This project uses automated versioning and changelog generation based on conventional commits.

### Quick Release

```bash
# Automatic version bump based on commits
npm run release

# Or use the interactive script
./scripts/release.sh
```

### Documentation

For detailed information about the release process, see:

- 📖 [Release Process Documentation](docs/RELEASE_PROCESS.md)
- 📝 [CHANGELOG.md](CHANGELOG.md) - Auto-generated changelog

## Commit Convention

To make a commit follow the [Conventional Commits 1.0.0 rules](https://www.conventionalcommits.org/en/v1.0.0/)

## Icons

All the icons in the application are handled using the library [Astro Icon](https://www.astroicon.dev/).

The icons should be added in `svg` format. To add a new icon create a file inside the folder located at `src/icons/`.

SVG Icons can be find in the [Iconify](https://icon-sets.iconify.design/) project.

## UI Components and Styling

For the UI components the library [Daisy UI](https://daisyui.com/) is been used.

To style the components the library [Tailwind CSS](https://tailwindcss.com/) is been used.

## Performance Optimization

This application has been optimized for production performance. Key optimizations include:

- **Font Loading**: Non-blocking font loading with preload strategy
- **React Hydration**: Strategic use of `client:idle`, `client:visible`, and `client:only`
- **Code Splitting**: Vendor chunks separated for better caching
- **Lazy Loading**: Heavy components loaded on-demand
- **Service Worker**: Static asset caching for faster subsequent loads
- **Image Optimization**: Lazy loading with fetchPriority support

### Performance Documents

- 📊 [Performance Summary](PERFORMANCE_SUMMARY.md) - Overview of all optimizations
- 📖 [Performance Guide](PERFORMANCE_OPTIMIZATION.md) - Detailed usage guidelines
- ✅ [Performance Checklist](PERFORMANCE_CHECKLIST.md) - Track optimization progress

### Testing Performance

```bash
# Build and test production performance
npm run build
npm run preview

# Run Lighthouse analysis (in another terminal)
npx lighthouse http://localhost:4321 --view
```

### Performance Best Practices

When adding new components:

1. Use appropriate hydration strategy:

   - `client:load` - Critical, above-the-fold content only
   - `client:idle` - Non-critical components (auth, toasts, etc.)
   - `client:visible` - Below-the-fold components
   - `client:only` - Client-side only components

2. Use OptimizedImage component:

   ```tsx
   import OptimizedImage from '@/components/React/Common/OptimizedImage';
   <OptimizedImage src="/image.jpg" alt="Description" />;
   ```

3. Lazy load heavy components:
   ```tsx
   import { lazy, Suspense } from 'react';
   const Heavy = lazy(() => import('./Heavy'));
   ```

For more details, see [PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md).
