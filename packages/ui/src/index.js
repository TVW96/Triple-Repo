import { nativeTokens } from "./native.js";
import { uiTokens } from "./tokens.js";

export { nativeTokens, uiTokens };

export function formatCoins(amount, coinCode = "MGC") {
  return `${amount.toLocaleString()} ${coinCode}`;
}
