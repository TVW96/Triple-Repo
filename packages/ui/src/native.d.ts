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
