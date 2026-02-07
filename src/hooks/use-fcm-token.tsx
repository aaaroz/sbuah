import { fetchToken, messaging } from "@/server/firebase";
import { onMessage, type Unsubscribe } from "firebase/messaging";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

async function getNotificationPermissionToken() {
  console.log("Get Notif Permission Token");

  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notifications");
    return;
  }

  if (Notification.permission === "granted") {
    console.log("Get Notif Permission Token Granted");
    return await fetchToken();
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") return await fetchToken();
  }

  console.log("Notification permission denied");
  return null;
}

const useFcmToken = () => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = async () => {
    if (isLoading.current) return;
    isLoading.current = true;
    const token = await getNotificationPermissionToken();

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.info(
        "%cPush Notification issue - permission denied",
        "background: red; color: white; padding: 8px; font-size: 20px",
      );
      isLoading.current = false;
      return;
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        alert("Unable to load token, refresh the browser!");
        console.info(
          "%cPush Notification issue - unable to load token after 3 retries",
          "background: red; color: white; padding: 8px; font-size: 20px",
        );
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("An error occurred while fetching the token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    isLoading.current = false;
  };

  useEffect(() => {
    if ("Notification" in window) {
      void loadToken();
    }
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return;
      console.log(`onMessage registered with token: ${token}`);
      const m = await messaging();
      if (!m) return;

      /* eslint-disable @typescript-eslint/no-unsafe-call */
      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;
        console.log("Foreground push notification received: ", payload);
        const link = payload.fcmOptions?.link ?? payload.data?.link;

        if (link) {
          toast.info(
            `${payload.notification?.title}: ${payload.notification?.body}`,
            {
              action: {
                label: "Visit",
                onClick: () => {
                  const link = payload.fcmOptions?.link ?? payload.data?.link;
                  if (link) {
                    router.push(link);
                  }
                },
              },
            },
          );
        } else {
          toast.info(
            `${payload.notification?.title}: ${payload.notification?.body}`,
          );
        }

        const n = new Notification(
          payload.notification?.title ?? "New Message",
          {
            body: payload.notification?.body ?? "This is a new message.",
            data: link ? { url: link } : undefined,
          },
        );

        n.onclick = (event) => {
          event.preventDefault();
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const link = (event.target as any)?.data?.url;
          if (link) {
            router.push(link as string);
          } else {
            console.log("No link found in the notification payload.");
          }
        };
      });

      /* eslint-disable @typescript-eslint/no-unsafe-return */
      return unsubscribe;
    };

    let unsubscribe: Unsubscribe | null = null;
    void setupListener().then((u) => {
      if (u) {
        unsubscribe = u;
      }
    });

    return () => unsubscribe?.();
  }, [token, router, toast]);

  return { token, notificationPermissionStatus };
};
export default useFcmToken;
