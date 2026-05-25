export declare const OrderStatus: Readonly<{
  PENDING: "pending";
  PAID: "paid";
  FULFILLED: "fulfilled";
  CANCELLED: "cancelled";
}>;

export declare const CoinTransactionType: Readonly<{
  PURCHASE: "purchase";
  SPEND: "spend";
  REFUND: "refund";
}>;

export declare const apiPaths: Readonly<{
  health: "/health";
  authLogin: "/auth/login";
  books: "/books";
  orders: "/orders";
  wallet: "/coins/wallet";
  coinTopUp: "/coins/purchase";
}>;
