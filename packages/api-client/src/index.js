import { appConfig } from "@mangamagnet/config";
import { apiPaths } from "@mangamagnet/contracts";

const defaultHeaders = {
  "Content-Type": "application/json",
};

function withBase(path) {
  return `${appConfig.apiBaseUrl}${path}`;
}

export function createApiClient(options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  if (!fetchImpl) {
    throw new Error(
      "No fetch implementation available. Provide fetchImpl in createApiClient(options).\n",
    );
  }

  async function request(path, init = {}) {
    const response = await fetchImpl(withBase(path), {
      ...init,
      headers: {
        ...defaultHeaders,
        ...(init.headers ?? {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API request failed (${response.status}): ${text}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  return {
    health: () => request(apiPaths.health),
    login: (payload) =>
      request(apiPaths.authLogin, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    listBooks: () => request(apiPaths.books),
    getWallet: () => request(apiPaths.wallet),
    createCoinTopUp: (payload) =>
      request(apiPaths.coinTopUp, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  };
}
