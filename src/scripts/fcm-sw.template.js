/* eslint-disable no-undef */

const FIREBASE_VERSION = '12.2.1';

importScripts(
  `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app-compat.js`
);
importScripts(
  `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-messaging-compat.js`
);

// The configuration will be injected at build time
const firebaseConfig = __FIREBASE_CONFIG__;

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Background message received.',
    payload
  );

  // If payload has notification object, Firebase will handle it automatically
  // Only show custom notification when payload.notification is not present to avoid double notifications
  if (!payload.notification && payload.data) {
    const title = payload.data.title || 'Notificación';
    const body = payload.data.body || 'Tienes una nueva notificación';
    const notificationOptions = {
      body: body,
      icon: payload.data.icon || '/images/favicon.svg',
      badge: payload.data.badge || '/images/favicon.svg',
      data: payload.data,
      ...(payload.data.image && { image: payload.data.image }),
    };
    self.registration.showNotification(title, notificationOptions);
  }
});
