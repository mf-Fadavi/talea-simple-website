"use client";

import { useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;
const token = process.env.NEXT_PUBLIC_DIFY_TOKEN;

declare global {
  interface Window {
    difyChatbotConfig?: {
      token: string;
      baseUrl: string;
    };
  }
}

export function DifyChat() {
  useEffect(() => {
    // Dify's embed script requires window.difyChatbotConfig to exist before it
    // runs, and looks up its own <script> tag by id === token.
    if (!baseUrl || !token || document.getElementById(token)) return;

    window.difyChatbotConfig = { token, baseUrl };

    const script = document.createElement("script");
    script.src = `${baseUrl.replace(/\/$/, "")}/embed.min.js`;
    script.id = token;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
