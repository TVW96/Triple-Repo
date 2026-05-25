type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "buyer" | "seller" | "admin";
};

type SessionResponse = {
  accessToken: string;
  user: SessionUser;
};

const demoUsers: Array<{ email: string; password: string; user: SessionUser }> =
  [
    {
      email: "demo@mangamagnet.dev",
      password: "pass123",
      user: {
        id: "u_demo",
        email: "demo@mangamagnet.dev",
        name: "Demo Buyer",
        role: "buyer",
      },
    },
    {
      email: "admin@mangamagnet.dev",
      password: "admin123",
      user: {
        id: "u_admin",
        email: "admin@mangamagnet.dev",
        name: "Admin User",
        role: "admin",
      },
    },
  ];

const demoBooks = [
  {
    id: "bk-1",
    title: "20th Century Boys Vol. 1",
    priceCoins: 120,
    status: "paid",
  },
  { id: "bk-2", title: "Monster Vol. 3", priceCoins: 90, status: "pending" },
];

const demoWallet = {
  balance: 420,
  currency: "MGC",
};

function makeResponse(status: number, payload: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(payload),
    json: async () => payload,
  };
}

export function createWebMockFetch() {
  return async (input: string, init?: { body?: string }) => {
    const url = String(input);

    if (url.endsWith("/auth/login")) {
      const credentials = init?.body
        ? JSON.parse(init.body)
        : { email: "", password: "" };
      const match = demoUsers.find(
        (entry) =>
          entry.email === credentials.email &&
          entry.password === credentials.password,
      );

      if (!match) {
        return makeResponse(401, { error: "Invalid credentials" });
      }

      const session: SessionResponse = {
        accessToken: `token_${match.user.id}`,
        user: match.user,
      };

      return makeResponse(200, session);
    }

    if (url.endsWith("/books")) {
      return makeResponse(200, demoBooks);
    }

    if (url.endsWith("/coins/wallet")) {
      return makeResponse(200, demoWallet);
    }

    if (url.endsWith("/health")) {
      return makeResponse(200, { ok: true });
    }

    return makeResponse(404, { error: "Not found" });
  };
}
