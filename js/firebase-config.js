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

// Firebase Cloud Messaging for Web Push Notifications
// VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web configuration
const VAPID_KEY = 'BDe0-lGSMqgfDl6VhQhSPQxYDMxTq3kN_gKxP3C8pYqKq_Z8yHjmPLqVnkq3qJYBPqQJzH8lKPjHQ3xLzKZRQHE';

let messaging = null;

// Initialize messaging if supported
async function initializeMessaging() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  if (!firebase.messaging) {
    console.log('Firebase messaging not loaded');
    return null;
  }

  try {
    messaging = firebase.messaging();

    // Register service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration.scope);
    }

    return messaging;
  } catch (error) {
    console.error('Failed to initialize messaging:', error);
    return null;
  }
}

// Request notification permission and get FCM token
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Initialize messaging if not already done
    if (!messaging) {
      await initializeMessaging();
    }

    if (!messaging) {
      return null;
    }

    // Get the token with VAPID key
    const token = await messaging.getToken({ vapidKey: VAPID_KEY });
    console.log('FCM Web Token obtained');
    return token;
  } catch (error) {
    console.error('Error getting notification token:', error);
    return null;
  }
}

// Save web FCM token to Firestore for the current user
async function saveWebFcmToken(userId, token) {
  if (!userId || !token) return false;

  try {
    await db.collection('users').doc(userId).set({
      fcmWebToken: token,
      fcmWebTokenUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('Web FCM token saved to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving web FCM token:', error);
    return false;
  }
}

// Handle foreground messages
function setupForegroundMessageHandler() {
  if (!messaging) return;

  messaging.onMessage((payload) => {
    console.log('Foreground message received:', payload);

    const title = payload.notification?.title || 'TripPortier';
    const body = payload.notification?.body || '';

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/assets/images/logo.png',
        tag: 'tripportier-foreground'
      });
    }
  });
}

// Export for use in other modules
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseFunctions = functions;
window.requestNotificationPermission = requestNotificationPermission;
window.saveWebFcmToken = saveWebFcmToken;
window.initializeMessaging = initializeMessaging;
window.setupForegroundMessageHandler = setupForegroundMessageHandler;
