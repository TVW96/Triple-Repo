import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import WebHomePage from "./page";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
  }),
}));

describe("Web login", () => {
  beforeEach(() => {
    window.localStorage.clear();
    push.mockReset();
  });

  it("logs in with valid credentials and redirects to market", async () => {
    render(<WebHomePage />);

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/market");
    });

    expect(window.localStorage.getItem("mm_web_session")).toContain(
      "Demo Buyer",
    );
  });

  it("shows error with invalid credentials", async () => {
    render(<WebHomePage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@demo.dev" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "bad" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
