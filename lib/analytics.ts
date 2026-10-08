// Thin wrapper around the Meta Pixel. Safe to call anywhere on the client:
// does nothing when the pixel isn't loaded (dev, admin, blocked by the
// visitor's browser). Never pass personal data (names, phones, emails).

type FbqParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: (command: "track" | "trackCustom" | "init", event: string, params?: FbqParams) => void;
  }
}

export function track(event: "PageView" | "Lead" | "Contact" | "ViewContent", params?: FbqParams) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
