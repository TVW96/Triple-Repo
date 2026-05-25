import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MarketPage from "./page";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace,
  }),
}));

describe("Market route guard", () => {
  it("redirects to login when no session is present", async () => {
    window.localStorage.removeItem("mm_web_session");
    render(<MarketPage />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/");
    });

    expect(screen.getByText(/checking session/i)).toBeInTheDocument();
  });
});
