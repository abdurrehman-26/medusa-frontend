"use server"

import Medusa from "@medusajs/js-sdk";
import { cookies } from "next/headers";

export async function createSessionedSdk() {
  if (!process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
    throw new Error("Medusa backend URL not set")
  }
  const userCookies = await cookies()
  return new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    auth: { type: "session" },
    globalHeaders: {
      "Cookie": userCookies.toString()
    }
  });
}