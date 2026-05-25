"use client";

import { createApiClient } from "@mangamagnet/api-client";
import { appConfig } from "@mangamagnet/config";
import React from "react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { createWebMockFetch } from "../lib/mockApi";
import { setWebSession } from "../lib/session";

export default function WebHomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@mangamagnet.dev");
  const [password, setPassword] = useState("pass123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const client = useMemo(
    () => createApiClient({ fetchImpl: createWebMockFetch() }),
    [],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await client.login({ email, password });
      setWebSession(session);
      router.push("/market");
    } catch {
      setError("Invalid credentials. Try demo@mangamagnet.dev / pass123.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">MangaMagnet</p>
        <h1>Login</h1>
        <p>Sign in to test listing, buying, selling, and coin wallet flows.</p>
        <p>
          API Base: <code>{appConfig.apiBaseUrl}</code>
        </p>

        <form onSubmit={onSubmit} className="authForm">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="demo@mangamagnet.dev"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="pass123"
            />
          </label>

          {error ? <p className="errorText">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="hint">
          Demo users: demo@mangamagnet.dev / pass123, admin@mangamagnet.dev /
          admin123
        </p>
      </section>
    </main>
  );
}
