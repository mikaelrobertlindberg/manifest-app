# Codemagic Setup Guide - iOS Build Fix

## Environment Variables Configuration

### 1. Create Environment Variable Group in Codemagic

1. Go to Codemagic Dashboard → Teams & Account → Environment variables
2. Create a new group called `expo_credentials`
3. Add the following variable:

**Variable Name:** `EXPO_TOKEN`  
**Variable Value:** `yriXob2aBSr_r9Jmp0Hm1xtVoAccl3h951Wrt1ae`  
**Scope:** Secure (check this box)

### 2. Alternative: Project-Specific Environment Variables

If the group approach doesn't work:

1. Go to your project settings in Codemagic
2. Navigate to "Environment variables" section
3. Add the variable directly:
   - **Variable name:** `EXPO_TOKEN`
   - **Variable value:** `yriXob2aBSr_r9Jmp0Hm1xtVoAccl3h951Wrt1ae`
   - **Group:** None (leave empty)
   - **Secure:** ✓ (checked)

## Troubleshooting Steps

### If Authentication Still Fails:

1. **Run the debug workflow first:**
   ```yaml
   # Use the 'debug-auth' workflow to test authentication only
   ```

2. **Check token validity:**
   - Log in to expo.dev with your account
   - Go to Account Settings → Access Tokens
   - Verify the token `yriXob2aBSr_r9Jmp0Hm1xtVoAccl3h951Wrt1ae` is listed and active

3. **Generate new token if needed:**
   ```bash
   # On your local machine
   npx expo login
   npx expo whoami
   npx expo token:create --name "codemagic-ci"
   ```

### Common Issues & Solutions:

#### Issue 1: "EXPO_TOKEN not found"
- **Cause:** Environment variable group not properly linked
- **Solution:** Use project-specific variables instead of groups

#### Issue 2: "Authentication failed despite token being set"
- **Cause:** Token might be expired or invalid
- **Solution:** Generate a new token and update Codemagic

#### Issue 3: "EAS CLI not recognizing token"
- **Cause:** EAS CLI version compatibility
- **Solution:** Fixed in updated config with specific EAS CLI version

## Verification Steps

### 1. Test Locally First:
```bash
cd ManifestApp
export EXPO_TOKEN="yriXob2aBSr_r9Jmp0Hm1xtVoAccl3h951Wrt1ae"
npx eas whoami
npx eas build --platform ios --profile ios-beta --local
```

### 2. Use Debug Workflow:
Run the `debug-auth` workflow in Codemagic to test authentication without building.

## Key Changes in Updated Config:

1. **Environment variable groups:** Using `expo_credentials` group
2. **Explicit authentication step:** Separate verification before build
3. **Alternative auth method:** Token-stdin fallback
4. **Better debugging:** Comprehensive environment checks
5. **Stable EAS CLI version:** Using specific version @13.9.0
6. **Export EAS_TOKEN:** Ensuring EAS CLI sees the token

## Build Profiles Available:

From `eas.json`:
- `development` - Development client
- `preview` - Internal distribution with simulator
- `production` - Store distribution
- `ios-beta` - Internal distribution for real devices
- `ios-production` - Store distribution

Currently using `ios-beta` for CI builds.