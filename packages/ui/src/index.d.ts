export type UITokens = {
  color: {
    backgroundBase: string;
    backgroundSurface: string;
    backgroundSurfaceAlt: string;
    textPrimary: string;
    textMuted: string;
    textSubtle: string;
    border: string;
    accent: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
  };
};

export declare const uiTokens: UITokens;

export type NativeTokens = {
  colors: {
    backgroundBase: string;
    surface: string;
    border: string;
    textPrimary: string;
    textMuted: string;
    textSubtle: string;
    accent: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    md: number;
    lg: number;
    xl: number;
  };
};

export declare const nativeTokens: NativeTokens;

export declare function formatCoins(amount: number, coinCode?: string): string;
