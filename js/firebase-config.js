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

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

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
