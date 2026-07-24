"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  type AppCheck,
} from "firebase/app-check";
import { getFirebaseWebConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let appCheck: AppCheck | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* keys to .env.local",
    );
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(getFirebaseWebConfig());
    const siteKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY?.trim();
    if (siteKey && typeof window !== "undefined" && !appCheck) {
      try {
        appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch {
        /* App Check optional until Console + key ready */
      }
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}
