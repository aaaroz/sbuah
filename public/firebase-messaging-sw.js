/* eslint-disable */

// @ts-ignore
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js",
);
// @ts-ignore
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyAXC7XeTdEssYSIWhVtL0yPxP2_dhQIGPo",
  authDomain: "zora-ecommerce-a8053.firebaseapp.com",
  databaseURL:
    "https://zora-ecommerce-a8053-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zora-ecommerce-a8053",
  storageBucket: "zora-ecommerce-a8053.appspot.com",
  messagingSenderId: "214048429856",
  appId: "1:214048429856:web:b7855090d6836b540ce945",
};

// @ts-expect-error due to the missing type
firebase.initializeApp(firebaseConfig);

// @ts-expect-error due to the missing type
const messaging = firebase.messaging();

// @ts-expect-error due to the missing type
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const link = payload.fcmOptions?.link || payload.data?.link;

  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/favicon.ico",
    data: { url: link },
  };

  // @ts-expect-error due to the missing type
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] notificationclick Received.");

  // @ts-expect-error due to the missing type
  event.notification.close();

  // @ts-expect-error due to the missing type
  event.waitUntil(
    // @ts-expect-error due to the missing type
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      // @ts-expect-error due to the missing type
      .then((clientList) => {
        // @ts-expect-error due to the missing type
        const url = event.notification.data.url;

        if (!url) return;

        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        // @ts-expect-error due to the missing type
        if (clients.openWindow) {
          console.log("openWindow on client");
          // @ts-expect-error due to the missing type
          return clients.openWindow(url);
        }
      }),
  );
});
