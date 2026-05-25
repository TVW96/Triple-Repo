export type AppConfig = {
  appName: string;
  environment: string;
  apiBaseUrl: string;
  coin: {
    displayName: string;
    code: string;
  };
};

export declare const appConfig: AppConfig;

export declare const appRoutes: {
  web: string;
  admin: string;
  mobile: string;
};
