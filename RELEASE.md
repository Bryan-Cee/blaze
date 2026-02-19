# Release Pipeline Documentation

This document explains how to use the automated release pipeline for the Blaze app.

## Overview

The release pipeline automatically builds an Android APK and creates a GitHub release when you push a version tag. The pipeline is configured to use EAS (Expo Application Services) for building the APK.

## Prerequisites

Before you can use the release pipeline, you need to:

1. **Create an Expo account** at [expo.dev](https://expo.dev) if you don't have one
2. **Generate an Expo access token**:
   - Go to [expo.dev/accounts/[your-username]/settings/access-tokens](https://expo.dev/accounts)
   - Create a new access token with appropriate permissions
3. **Add the token to GitHub Secrets**:
   - Go to your repository Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: Your Expo access token

## Creating a Release

To trigger a release build:

1. Update the version number in `app.json` and `package.json`:
   ```json
   // app.json
   {
     "expo": {
       "version": "1.0.1"
     }
   }
   
   // package.json
   {
     "version": "1.0.1"
   }
   ```

2. Commit your changes:
   ```bash
   git add app.json package.json
   git commit -m "Bump version to 1.0.1"
   git push
   ```

3. Create and push a version tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

4. The pipeline will automatically:
   - Build the Android APK using EAS Build
   - Wait for the build to complete
   - Create a GitHub release with the APK attached
   - Name the release "Blaze v1.0.1"

## Monitoring the Build

1. Go to the **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Monitor the build progress in real-time
4. The build typically takes 10-20 minutes to complete

## Build Profiles

The pipeline uses the `production` build profile defined in `eas.json`:

- **production**: Optimized APK build for release
- **preview**: Internal testing APK (not used in the pipeline)
- **development**: Development client build (not used in the pipeline)

## Troubleshooting

### Build fails with "Unauthorized"
- Verify that the `EXPO_TOKEN` secret is set correctly in GitHub
- Check that the token has not expired

### Build takes longer than 30 minutes
- The pipeline has a 30-minute timeout for builds
- If your build is timing out, you may need to optimize your build or increase the timeout in the workflow file

### APK not appearing in release
- Check the workflow logs for any download errors
- Verify that the EAS build completed successfully

## Manual Build (Alternative)

If you prefer to build manually:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build the APK
eas build --platform android --profile production

# Download the APK when complete
# Upload manually to GitHub Releases
```

## Configuration Files

- `.github/workflows/release.yml` - GitHub Actions workflow
- `eas.json` - EAS Build configuration
- `app.json` - Expo app configuration (includes version and package name)
- `package.json` - NPM package configuration (includes version)
