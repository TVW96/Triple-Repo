"use client";

import { createApiClient } from "@mangamagnet/api-client";
import { appConfig } from "@mangamagnet/config";
import { formatCoins } from "@mangamagnet/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useMemo, useState } from "react";

import { createWebMockFetch } from "../../lib/mockApi";
import {
  clearWebSession,
  getWebSession,
  type WebSession,
} from "../../lib/session";

type Book = {
  id: string;
  title: string;
  priceCoins: number;
  status: string;
};

type Wallet = {
  balance: number;
  currency: string;
};

export default function MarketPage() {
  const router = useRouter();
  const [session, setSession] = useState<WebSession | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftPrice, setDraftPrice] = useState("0");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const client = useMemo(
    () => createApiClient({ fetchImpl: createWebMockFetch() }),
    [],
  );

  useEffect(() => {
    const currentSession = getWebSession();

    if (!currentSession) {
      router.replace("/");
      return;
    }

    setSession(currentSession);

    client
      .listBooks()
      .then((data: unknown) =>
        setBooks(Array.isArray(data) ? (data as Book[]) : []),
      )
      .catch(() => setBooks([]));

    client
      .getWallet()
      .then((data: unknown) => setWallet((data ?? null) as Wallet | null))
      .catch(() => setWallet(null));
  }, [client, router]);

  function logout() {
    clearWebSession();
    router.push("/");
  }

  function createListing() {
    if (!draftTitle.trim()) {
      return;
    }

    const priceCoins = Number(draftPrice);
    if (Number.isNaN(priceCoins) || priceCoins <= 0) {
      return;
    }

    setBooks((prev) => [
      {
        id: `user-${Date.now()}`,
        title: draftTitle.trim(),
        priceCoins,
        status: "pending",
      },
      ...prev,
    ]);

    setDraftTitle("");
    setDraftPrice("0");
  }

  if (!session) {
    return (
      <main className="page">
        <section className="card">
          <h1>Checking session…</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">MangaMagnet</p>
        <h1>Web Marketplace</h1>
        <p>
          Logged in as <strong>{session.user.name}</strong> ({session.user.role}
          )
        </p>
        <p>
          Wallet:{" "}
          <strong>
            {wallet
              ? formatCoins(wallet.balance, wallet.currency)
              : "Loading..."}
          </strong>
        </p>
        <p>
          API Base: <code>{appConfig.apiBaseUrl}</code>
        </p>

        <div className="authForm">
          <label>
            Listing title
            <input
              type="text"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="e.g. Vagabond Vol. 2"
            />
          </label>
          <label>
            Price ({appConfig.coin.code})
            <input
              type="number"
              min={1}
              value={draftPrice}
              onChange={(event) => setDraftPrice(event.target.value)}
            />
          </label>
          <button type="button" onClick={createListing}>
            Create listing
          </button>
        </div>

        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} — {formatCoins(book.priceCoins, appConfig.coin.code)}{" "}
              ({book.status})
            </li>
          ))}
        </ul>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </section>
    </main>
  );
}
