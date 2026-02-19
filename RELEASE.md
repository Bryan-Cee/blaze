# Release Pipeline Documentation

This document explains how to use the automated release pipeline for the Blaze app.

## Overview

The release pipeline uses a two-phase architecture to avoid tying up a GitHub Actions runner for 60+ minutes:

1. **Build phase** (`build.yml`): A tag push triggers `eas build --no-wait`, which kicks off an EAS build and exits immediately (~2 min runner time).
2. **Release phase** (`release.yml`): When EAS finishes building, it sends a webhook to a Cloudflare Worker, which verifies the signature and dispatches a `repository_dispatch` event to GitHub. This triggers the release workflow, which downloads the APK and creates a GitHub Release (~2 min runner time).

```
Tag push (v*) --> build.yml (eas build --no-wait, ~2 min)
                       |
                 EAS Build Service (10-60 min)
                       |
                 EAS Webhook POST
                       |
                 Cloudflare Worker (verify signature, filter, forward)
                       |
                 GitHub repository_dispatch
                       |
                 release.yml (download APK, create release, ~2 min)
```

## Prerequisites

Before you can use the release pipeline, you need:

1. **Expo account** at [expo.dev](https://expo.dev)
2. **Expo access token** added as `EXPO_TOKEN` in GitHub Secrets
3. **Cloudflare Worker deployed** (see [Initial Setup](#initial-setup) below)
4. **EAS webhook registered** pointing to the worker URL

## Initial Setup

These steps are required once after merging the pipeline code:

### 1. Generate a webhook secret

```bash
openssl rand -hex 32
```

Save this value — you'll use it for both the worker and EAS webhook.

### 2. Create a GitHub Fine-Grained PAT

- Go to GitHub Settings > Developer settings > Fine-grained tokens
- Create a token scoped to `Bryan-Cee/blaze` with **Contents: Read and write** permission
- This is required because the built-in `GITHUB_TOKEN` cannot trigger `repository_dispatch`

### 3. Deploy the Cloudflare Worker

```bash
cd webhook-relay
npm install
npx wrangler login
npx wrangler secret put WEBHOOK_SECRET   # paste the secret from step 1
npx wrangler secret put GITHUB_TOKEN     # paste the PAT from step 2
npx wrangler deploy
```

Note the worker URL from the deploy output (e.g., `https://eas-webhook-relay.<your-subdomain>.workers.dev`).

### 4. Register the EAS webhook

```bash
eas webhook:create --event BUILD --url <worker-url> --secret <webhook-secret>
```

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
   - Trigger an EAS build via `build.yml` (~2 min)
   - EAS builds the Android APK (10-60 min, no runner occupied)
   - EAS webhook notifies the Cloudflare Worker
   - Worker dispatches `repository_dispatch` to GitHub
   - `release.yml` downloads the APK and creates a GitHub Release

## Monitoring

- **Build trigger**: Check the Actions tab for the `Build` workflow
- **EAS build progress**: Run `eas build:list` or check [expo.dev](https://expo.dev)
- **Worker logs**: Run `cd webhook-relay && npx wrangler tail`
- **Release creation**: Check the Actions tab for the `Release` workflow

## Build Profiles

The pipeline uses the `production` build profile defined in `eas.json`:

- **production**: Optimized APK build for release
- **preview**: Internal testing APK (not used in the pipeline)
- **development**: Development client build (not used in the pipeline)

## Troubleshooting

### Build trigger fails with "Unauthorized"
- Verify that the `EXPO_TOKEN` secret is set correctly in GitHub
- Check that the token has not expired

### EAS build completes but no release is created
- Check worker logs: `cd webhook-relay && npx wrangler tail`
- Verify the webhook secret matches between EAS and the worker
- Verify the GitHub PAT is valid and has Contents read/write permission
- Check that the EAS webhook is registered: `eas webhook:list`

### Release workflow runs but APK download fails
- Check that `buildUrl` is present in the webhook payload
- The EAS build may have failed — check `eas build:list`

### APK not appearing in release
- Check the `Release` workflow logs for download errors
- Verify the tag exists: `git tag -l`

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

- `.github/workflows/build.yml` - Build trigger workflow (tag push)
- `.github/workflows/release.yml` - Release workflow (repository_dispatch)
- `webhook-relay/` - Cloudflare Worker that relays EAS webhooks to GitHub
- `eas.json` - EAS Build configuration
- `app.json` - Expo app configuration (includes version and package name)
- `package.json` - NPM package configuration (includes version)
