import { env } from "@/env";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

const fetchToken = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" },
    );

    const messaging = getMessaging(app);
    console.log({ messaging });
    console.log({ registration });

    if (!registration) {
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    console.log({ token });

    return token;
  } catch (err) {
    console.error("FCM token error", err);
    return null;
  }
};
export { app, messaging, fetchToken };
