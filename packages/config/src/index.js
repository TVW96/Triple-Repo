export const appConfig = {
  appName: "MangaMagnet",
  environment: process.env.NODE_ENV ?? "development",
  apiBaseUrl: process.env.MANGAMAGNET_API_BASE_URL ?? "http://localhost:4000",
  coin: {
    displayName: "Manga Coins",
    code: "MGC",
  },
};

export const appRoutes = {
  web: "/",
  admin: "/",
  mobile: "mangamagnet://home",
};
