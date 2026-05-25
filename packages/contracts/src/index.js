export const OrderStatus = Object.freeze({
  PENDING: "pending",
  PAID: "paid",
  FULFILLED: "fulfilled",
  CANCELLED: "cancelled",
});

export const CoinTransactionType = Object.freeze({
  PURCHASE: "purchase",
  SPEND: "spend",
  REFUND: "refund",
});

export const apiPaths = Object.freeze({
  health: "/health",
  authLogin: "/auth/login",
  books: "/books",
  orders: "/orders",
  wallet: "/coins/wallet",
  coinTopUp: "/coins/purchase",
});
