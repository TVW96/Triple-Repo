import assert from "node:assert/strict";
import test from "node:test";

import { createApiClient } from "../src/index.js";

test("listBooks calls the books endpoint", async () => {
  let capturedUrl = "";

  const client = createApiClient({
    fetchImpl: async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        status: 200,
        text: async () => "",
        json: async () => [{ id: "bk-1", title: "Pluto Vol. 1" }],
      };
    },
  });

  const books = await client.listBooks();

  assert.equal(capturedUrl.endsWith("/books"), true);
  assert.deepEqual(books, [{ id: "bk-1", title: "Pluto Vol. 1" }]);
});

test("createCoinTopUp sends POST body payload", async () => {
  let capturedInit;

  const client = createApiClient({
    fetchImpl: async (_url, init) => {
      capturedInit = init;
      return {
        ok: true,
        status: 200,
        text: async () => "",
        json: async () => ({ success: true }),
      };
    },
  });

  await client.createCoinTopUp({ amount: 500, paymentMethod: "stripe" });

  assert.equal(capturedInit?.method, "POST");
  assert.equal(
    capturedInit?.body,
    JSON.stringify({ amount: 500, paymentMethod: "stripe" }),
  );
});

test("request throws on non-ok response", async () => {
  const client = createApiClient({
    fetchImpl: async () => ({
      ok: false,
      status: 500,
      text: async () => "server_error",
      json: async () => ({}),
    }),
  });

  await assert.rejects(
    () => client.health(),
    /API request failed \(500\): server_error/,
  );
});

test("login sends credentials and returns session payload", async () => {
  let capturedUrl = "";
  let capturedInit;

  const client = createApiClient({
    fetchImpl: async (url, init) => {
      capturedUrl = url;
      capturedInit = init;

      return {
        ok: true,
        status: 200,
        text: async () => "",
        json: async () => ({
          accessToken: "token_demo",
          user: {
            id: "u_1",
            email: "demo@mangamagnet.dev",
            name: "Demo User",
            role: "buyer",
          },
        }),
      };
    },
  });

  const session = await client.login({
    email: "demo@mangamagnet.dev",
    password: "pass123",
  });

  assert.equal(capturedUrl.endsWith("/auth/login"), true);
  assert.equal(capturedInit?.method, "POST");
  assert.equal(
    capturedInit?.body,
    JSON.stringify({ email: "demo@mangamagnet.dev", password: "pass123" }),
  );
  assert.equal(session.user.role, "buyer");
});
