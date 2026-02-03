// Supabase Configuration for TripPortier Website
// Replaces firebase-config.js for the migration

const SUPABASE_URL = 'https://bomkdhuckqosvuhfhyci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWtkaHVja3Fvc3Z1aGZoeWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTMyMzcsImV4cCI6MjA4NDIyOTIzN30._8b1WeXxsSk1liFPHReI4maFc7yv8fY_vAbOXZJXQTo';

// Check if Supabase SDK is loaded
if (!window.supabase) {
  console.error('Supabase SDK not loaded! Make sure the CDN script is included before this file.');
}

// Initialize Supabase client (use different variable name to avoid shadowing global)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Firebase Compatibility Layer - allows existing code to work without rewriting
// This provides shims for firebase.firestore(), firebase.auth(), etc.
window.firebase = window.firebase || {};
window.firebase.firestore = function() {
  return window.firebaseDb;
};
window.firebase.firestore.FieldValue = {
  serverTimestamp: () => new Date().toISOString(),
  arrayUnion: (...items) => ({ __arrayUnion: items }),
  arrayRemove: (...items) => ({ __arrayRemove: items }),
  increment: (n) => ({ __increment: n }),
  delete: () => ({ __delete: true })
};
window.firebase.firestore.Timestamp = {
  fromDate: (date) => date instanceof Date ? date.toISOString() : new Date(date).toISOString(),
  now: () => new Date().toISOString()
};
window.firebase.auth = function() {
  return {
    currentUser: window.tripPortierAuth?.user || null,
    onAuthStateChanged: (callback) => {
      if (window.tripPortierAuth) {
        window.tripPortierAuth.addListener((user) => callback(user));
      }
    }
  };
};

// Edge Functions base URL
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

// Helper to call Edge Functions with auth
async function callEdgeFunction(functionName, data = {}, method = 'POST') {
  const session = await supabaseClient.auth.getSession();
  const token = session?.data?.session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(data) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Edge function failed');
  }

  return result;
}

// FCM Configuration (keeping Firebase for push notifications)
const VAPID_KEY = 'BDe0-lGSMqgfDl6VhQhSPQxYDMxTq3kN_gKxP3C8pYqKq_Z8yHjmPLqVnkq3qJYBPqQJzH8lKPjHQ3xLzKZRQHE';

let messaging = null;

// Initialize FCM messaging if supported (keeping Firebase for this)
async function initializeMessaging() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  // Check if Firebase messaging is available
  if (typeof firebase === 'undefined' || !firebase.messaging) {
    console.log('Firebase messaging not loaded (optional for push notifications)');
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

// Save web FCM token to Supabase for the current user
async function saveWebFcmToken(userId, token) {
  if (!userId || !token) return false;

  try {
    const { error } = await supabaseClient
      .from('users')
      .update({
        fcm_web_token: token,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    console.log('Web FCM token saved to Supabase');
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
window.supabaseClient = supabaseClient;
window.callEdgeFunction = callEdgeFunction;
window.supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
};
window.requestNotificationPermission = requestNotificationPermission;
window.saveWebFcmToken = saveWebFcmToken;
window.initializeMessaging = initializeMessaging;
window.setupForegroundMessageHandler = setupForegroundMessageHandler;

// Legacy compatibility aliases (for gradual migration)
window.firebaseDb = {
  collection: (name) => ({
    doc: (id) => ({
      get: async () => {
        const { data, error } = await supabaseClient.from(name).select('*').eq('id', id).single();
        return {
          exists: !!data && !error,
          data: () => data,
          id: id
        };
      },
      set: async (docData, options) => {
        if (options?.merge) {
          await supabaseClient.from(name).upsert({ id: id, ...docData });
        } else {
          await supabaseClient.from(name).insert({ id: id, ...docData });
        }
      },
      update: async (docData) => {
        await supabaseClient.from(name).update(docData).eq('id', id);
      },
      delete: async () => {
        await supabaseClient.from(name).delete().eq('id', id);
      },
      collection: (subName) => {
        // For subcollections like users/{id}/trips, we map to the trips table with user_id
        const parentField = name.slice(0, -1) + '_id'; // users -> user_id
        return {
          doc: (subId) => ({
            get: async () => {
              const { data, error } = await supabaseClient.from(subName).select('*').eq('id', subId).eq(parentField, id).single();
              return {
                exists: !!data && !error,
                data: () => data,
                id: subId
              };
            },
            delete: async () => {
              await supabaseClient.from(subName).delete().eq('id', subId).eq(parentField, id);
            }
          }),
          get: async () => {
            const { data, error } = await supabaseClient.from(subName).select('*').eq(parentField, id);
            return {
              docs: (data || []).map(d => ({
                id: d.id,
                data: () => d,
                exists: true
              })),
              empty: !data || data.length === 0
            };
          },
          orderBy: (field, direction = 'asc') => ({
            get: async () => {
              const { data } = await supabaseClient.from(subName).select('*').eq(parentField, id).order(field, { ascending: direction === 'asc' });
              return {
                docs: (data || []).map(d => ({
                  id: d.id,
                  data: () => d
                }))
              };
            }
          }),
          onSnapshot: (callback) => {
            // Set up real-time subscription
            const channel = supabaseClient
              .channel(`${subName}_${id}`)
              .on('postgres_changes', { event: '*', schema: 'public', table: subName, filter: `${parentField}=eq.${id}` }, (payload) => {
                // Re-fetch all data on any change
                supabaseClient.from(subName).select('*').eq(parentField, id).then(({ data }) => {
                  callback({
                    docs: (data || []).map(d => ({
                      id: d.id,
                      data: () => d
                    })),
                    forEach: (fn) => (data || []).forEach(d => fn({ id: d.id, data: () => d }))
                  });
                });
              })
              .subscribe();

            // Initial fetch
            supabaseClient.from(subName).select('*').eq(parentField, id).then(({ data }) => {
              callback({
                docs: (data || []).map(d => ({
                  id: d.id,
                  data: () => d
                })),
                forEach: (fn) => (data || []).forEach(d => fn({ id: d.id, data: () => d }))
              });
            });

            // Return unsubscribe function
            return () => supabaseClient.removeChannel(channel);
          }
        };
      }
    }),
    where: (field, op, value) => ({
      limit: (n) => ({
        get: async () => {
          let query = supabaseClient.from(name).select('*');
          if (op === '==') query = query.eq(field, value);
          query = query.limit(n);
          const { data } = await query;
          return {
            docs: (data || []).map(d => ({ id: d.id, data: () => d })),
            empty: !data || data.length === 0
          };
        }
      }),
      get: async () => {
        let query = supabaseClient.from(name).select('*');
        if (op === '==') query = query.eq(field, value);
        const { data } = await query;
        return {
          docs: (data || []).map(d => ({ id: d.id, data: () => d })),
          empty: !data || data.length === 0
        };
      }
    }),
    add: async (docData) => {
      const { data, error } = await supabaseClient.from(name).insert(docData).select().single();
      if (error) throw error;
      return { id: data.id };
    }
  })
};
