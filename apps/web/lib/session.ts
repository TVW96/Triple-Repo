const SESSION_KEY = "mm_web_session";

export type WebSession = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "buyer" | "seller" | "admin";
  };
};

export function getWebSession(): WebSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(SESSION_KEY);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as WebSession;
  } catch {
    return null;
  }
}

export function setWebSession(session: WebSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearWebSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}
