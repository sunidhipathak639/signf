# Firebase Authorized Domains Fix for Vercel Deployment

## Problem
Google login works on `localhost:3000` but fails on `https://signf.vercel.app/` because the Vercel domain is not authorized in Firebase.

## Root Cause
Firebase Authentication requires all domains that use Google OAuth to be explicitly authorized in the Firebase Console. By default, only `localhost` is authorized for development.

## Solution Steps

### 1. Add Vercel Domain to Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `kurage-kollect`
3. **Navigate to**: Authentication → Settings → Authorized domains
4. **Click "Add domain"**
5. **Add your Vercel domain**: `signf.vercel.app`
6. **Save the changes**

### 2. Verify Current Authorized Domains
Your authorized domains should include:
- `localhost` (for development)
- `signf.vercel.app` (for production)
- Any other custom domains you use

### 3. Additional Vercel Domains (if needed)
If you have preview deployments, you might also need to add:
- `*.vercel.app` (wildcard for all Vercel preview deployments)

### 4. Google Cloud Console (if using custom OAuth)
If you've customized your Google OAuth settings:
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Add `https://signf.vercel.app` to authorized origins
5. Add `https://signf.vercel.app/__/auth/handler` to authorized redirect URIs

## Testing Steps
1. Add the domain to Firebase Console
2. Wait 5-10 minutes for changes to propagate
3. Visit https://signf.vercel.app/
4. Try Google login - it should now work

## Common Issues
- **Changes not taking effect**: Wait 5-10 minutes after adding domains
- **Still not working**: Check browser console for specific error messages
- **Preview deployments failing**: Add `*.vercel.app` as authorized domain

## Verification
After adding the domain, you can verify by:
1. Opening browser dev tools
2. Going to https://signf.vercel.app/
3. Attempting login
4. Checking console for any remaining auth errors

The error you're likely seeing in the console is something like:
```
auth/unauthorized-domain: This domain (signf.vercel.app) is not authorized to run this operation.
```

This will be resolved once you add the domain to Firebase Console.