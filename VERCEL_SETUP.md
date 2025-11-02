# Vercel Environment Variables Setup

## Issue
The login functionality works locally but fails on Vercel deployment because environment variables are not configured in the Vercel dashboard.

## Solution
You need to add the following environment variables in your Vercel project dashboard:

### Steps to Fix:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (signf)
3. Go to Settings → Environment Variables
4. Add the following variables:

```
REACT_APP_FIREBASE_API_KEY = AIzaSyCSHzoVTugIu51gx5x4tug7FQkKT6Fc-CE
REACT_APP_FIREBASE_MESSAGE_ID = 880104039860
REACT_APP_FIREBASE_APP_ID = 1:880104039860:web:3577156793874958f6fee1
NODE_ENV = production
REACT_APP_FIREBASE_STORAGE_TRAINED_MODEL_25_04_2023 = https://firebasestorage.googleapis.com/v0/b/sign-language-ai.appspot.com/o/sign_language_recognizer_25-04-2023.task?alt=media&token=fce5727a-48a2-426a-be07-956964695cec
```

5. Make sure to set the environment for "Production", "Preview", and "Development"
6. Redeploy your application

### Important Notes:
- Environment variables in Vercel are separate from your local .env file
- After adding environment variables, you must redeploy for changes to take effect
- The Firebase configuration in your code is correct and doesn't need changes

### Verification:
After setting up the environment variables and redeploying:
1. Visit https://signf.vercel.app/
2. Try to login with Google
3. The login should now work properly

## Alternative Quick Fix:
If you want to test immediately, you can temporarily hardcode the values in firebase.js (NOT recommended for production):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCSHzoVTugIu51gx5x4tug7FQkKT6Fc-CE",
  authDomain: "kurage-kollect.firebaseapp.com",
  projectId: "kurage-kollect",
  storageBucket: "kurage-kollect.firebasestorage.app",
  messagingSenderId: "880104039860",
  appId: "1:880104039860:web:3577156793874958f6fee1",
};
```

But remember to revert this and use environment variables for security.