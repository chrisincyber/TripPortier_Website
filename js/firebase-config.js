// Firebase Configuration for TripPortier Website
// This config connects to the same Firebase project as the iOS app

const firebaseConfig = {
  apiKey: "AIzaSyCnNm1td9wHafv7bR4PAjWP73YcLum0J6E",
  authDomain: "tripportier.firebaseapp.com",
  projectId: "tripportier",
  storageBucket: "tripportier.firebasestorage.app",
  messagingSenderId: "512477527809",
  appId: "1:512477527809:web:c77ffc10673304f4f46500"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize App Check with reCAPTCHA v3
// Get your reCAPTCHA v3 site key from: https://www.google.com/recaptcha/admin
// Then register it in Firebase Console: App Check > Apps > Web App > reCAPTCHA v3
const RECAPTCHA_V3_SITE_KEY = '6LeFqTQsAAAAAPvOB057mgMHvNBmqOoalQI2Zjab';

if (typeof firebase.appCheck !== 'undefined') {
  const appCheck = firebase.appCheck();

  // Enable debug mode for localhost development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    // Debug token will be printed to console - register it in Firebase Console
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  appCheck.activate(
    new firebase.appCheck.ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
    true // Set to true to allow auto-refresh
  );
}

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const functions = typeof firebase.functions === 'function' ? firebase.functions() : null;

// Use emulator in development (uncomment for local testing)
// if (location.hostname === 'localhost') {
//   functions.useEmulator('localhost', 5001);
// }

// Enable local persistence for auth state (survives browser restart)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Export for use in other modules
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseFunctions = functions;
