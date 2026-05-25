type RequestInitLike = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

type ResponseLike = {
  ok: boolean;
  status: number;
  text(): Promise<string>;
  json(): Promise<unknown>;
};

type FetchLike = (
  input: string,
  init?: RequestInitLike,
) => Promise<ResponseLike>;

export type ApiClientOptions = {
  fetchImpl?: FetchLike;
};

export type CoinTopUpPayload = {
  amount: number;
  paymentMethod: "stripe" | "iap";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SessionResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "buyer" | "seller" | "admin";
  };
};

export type ApiClient = {
  health(): Promise<unknown>;
  login(payload: LoginPayload): Promise<SessionResponse>;
  listBooks(): Promise<unknown>;
  getWallet(): Promise<unknown>;
  createCoinTopUp(payload: CoinTopUpPayload): Promise<unknown>;
};

export declare function createApiClient(options?: ApiClientOptions): ApiClient;
