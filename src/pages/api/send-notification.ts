import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import type { Message } from "firebase-admin/messaging";
import { initializeApp, getApps, cert } from "firebase-admin/app";

interface RequestBody {
  token: string;
  title: string;
  message: string;
  link: string;
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { token, title, message, link } = req.body as RequestBody;

  if (!token || !title || !message || !link) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  const payload: Message = {
    token,
    notification: {
      title,
      body: message,
    },
    webpush: {
      fcmOptions: {
        link,
      },
    },
  };

  try {
    await admin.messaging().send(payload);

    return res
      .status(200)
      .json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("[SEND_NOTIFICATION_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
}
