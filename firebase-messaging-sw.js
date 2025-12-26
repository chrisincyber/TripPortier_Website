// Firebase Messaging Service Worker for Web Push Notifications
// This file MUST be at the root of the website

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCnNm1td9wHafv7bR4PAjWP73YcLum0J6E",
  authDomain: "tripportier.firebaseapp.com",
  projectId: "tripportier",
  storageBucket: "tripportier.firebasestorage.app",
  messagingSenderId: "512477527809",
  appId: "1:512477527809:web:c77ffc10673304f4f46500"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'TripPortier';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/assets/images/logo.png',
    badge: '/assets/images/logo.png',
    tag: 'tripportier-notification',
    data: payload.data || {},
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  // Handle action buttons
  if (event.action === 'dismiss') {
    return;
  }

  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || 'https://tripportier.com';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes('tripportier.com') && 'focus' in client) {
          return client.focus();
        }
      }
      // Open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
