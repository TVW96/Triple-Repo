import { createApiClient } from "@mangamagnet/api-client";
import { appConfig } from "@mangamagnet/config";
import { CoinTransactionType } from "@mangamagnet/contracts";
import { formatCoins, nativeTokens } from "@mangamagnet/ui";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Wallet = {
  balance: number;
  currency: string;
};

type Session = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "buyer" | "seller" | "admin";
  };
};

type Listing = {
  id: string;
  title: string;
  priceCoins: number;
  status: "pending" | "active";
};

export default function App() {
  const [email, setEmail] = useState("demo@mangamagnet.dev");
  const [password, setPassword] = useState("pass123");
  const [session, setSession] = useState<Session | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingTitle, setListingTitle] = useState("");
  const [listingPrice, setListingPrice] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const client = useMemo(
    () =>
      createApiClient({
        fetchImpl: async (input: string, init?: { body?: string }) => {
          const url = String(input);

          const jsonResponse = (status: number, payload: unknown) => ({
            ok: status >= 200 && status < 300,
            status,
            text: async () => JSON.stringify(payload),
            json: async () => payload,
          });

          if (url.endsWith("/auth/login")) {
            const credentials = init?.body
              ? JSON.parse(init.body)
              : { email: "", password: "" };
            if (
              credentials.email === "demo@mangamagnet.dev" &&
              credentials.password === "pass123"
            ) {
              return jsonResponse(200, {
                accessToken: "token_u_demo",
                user: {
                  id: "u_demo",
                  email: "demo@mangamagnet.dev",
                  name: "Demo Buyer",
                  role: "buyer",
                },
              });
            }

            return jsonResponse(401, { error: "Invalid credentials" });
          }

          if (url.endsWith("/coins/wallet")) {
            return jsonResponse(200, {
              balance: 420,
              currency: appConfig.coin.code,
            });
          }

          return jsonResponse(404, { error: "Not found" });
        },
      }),
    [],
  );

  async function login() {
    setLoading(true);
    setError(null);

    try {
      const nextSession = (await client.login({ email, password })) as Session;
      setSession(nextSession);

      const walletData = (await client.getWallet()) as Wallet;
      setWallet(walletData);
    } catch {
      setError("Invalid credentials. Use demo@mangamagnet.dev / pass123.");
      setSession(null);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setSession(null);
    setWallet(null);
    setListings([]);
    setListingTitle("");
    setListingPrice("0");
    setError(null);
  }

  function createListing() {
    if (!listingTitle.trim()) {
      return;
    }

    const priceCoins = Number(listingPrice);
    if (Number.isNaN(priceCoins) || priceCoins <= 0) {
      return;
    }

    setListings((prev) => [
      {
        id: `listing_${Date.now()}`,
        title: listingTitle.trim(),
        priceCoins,
        status: "pending",
      },
      ...prev,
    ]);

    setListingTitle("");
    setListingPrice("0");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>MangaMagnet Mobile</Text>

        {!session ? (
          <>
            <Text style={styles.body}>
              Sign in to test listing, buying, selling, and coin flows.
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor={nativeTokens.colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor={nativeTokens.colors.textMuted}
              style={styles.input}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable style={styles.button} onPress={login} disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? "Signing in..." : "Sign in"}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.body}>Welcome, {session.user.name}</Text>
            <Text style={styles.meta}>
              Coin Txn Type: {CoinTransactionType.PURCHASE}
            </Text>
            <Text style={styles.meta}>
              Wallet:{" "}
              {wallet
                ? formatCoins(wallet.balance, wallet.currency)
                : "Loading..."}
            </Text>

            <TextInput
              value={listingTitle}
              onChangeText={setListingTitle}
              placeholder="Listing title"
              placeholderTextColor={nativeTokens.colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={listingPrice}
              onChangeText={setListingPrice}
              keyboardType="numeric"
              placeholder="Price in coins"
              placeholderTextColor={nativeTokens.colors.textMuted}
              style={styles.input}
            />
            <Pressable style={styles.button} onPress={createListing}>
              <Text style={styles.buttonText}>Create listing</Text>
            </Pressable>

            {listings.map((listing) => (
              <Text key={listing.id} style={styles.meta}>
                {listing.title} —{" "}
                {formatCoins(listing.priceCoins, appConfig.coin.code)} (
                {listing.status})
              </Text>
            ))}

            <Pressable style={styles.buttonSecondary} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </>
        )}
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nativeTokens.colors.backgroundBase,
    alignItems: "center",
    justifyContent: "center",
    padding: nativeTokens.spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: nativeTokens.colors.surface,
    borderColor: nativeTokens.colors.border,
    borderWidth: 1,
    borderRadius: nativeTokens.radius.lg,
    padding: nativeTokens.spacing.xl,
  },
  title: {
    color: nativeTokens.colors.textPrimary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  body: {
    color: nativeTokens.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    borderRadius: nativeTokens.radius.md,
    color: nativeTokens.colors.textPrimary,
    backgroundColor: nativeTokens.colors.backgroundBase,
    paddingVertical: nativeTokens.spacing.md,
    paddingHorizontal: nativeTokens.spacing.lg,
    marginTop: nativeTokens.spacing.md,
  },
  button: {
    marginTop: nativeTokens.spacing.lg,
    borderRadius: nativeTokens.radius.md,
    backgroundColor: nativeTokens.colors.accent,
    paddingVertical: nativeTokens.spacing.md,
    alignItems: "center",
  },
  buttonSecondary: {
    marginTop: nativeTokens.spacing.lg,
    borderRadius: nativeTokens.radius.md,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    backgroundColor: nativeTokens.colors.backgroundBase,
    paddingVertical: nativeTokens.spacing.md,
    alignItems: "center",
  },
  buttonText: {
    color: nativeTokens.colors.textPrimary,
    fontWeight: "700",
  },
  errorText: {
    color: "#fda4af",
    marginTop: nativeTokens.spacing.md,
  },
  meta: {
    color: nativeTokens.colors.textSubtle,
    fontSize: 14,
    marginTop: 10,
  },
});
