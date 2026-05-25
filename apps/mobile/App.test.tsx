import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it } from "@jest/globals";

import App from "./App";

describe("Mobile App", () => {
  it("logs in successfully and shows wallet", async () => {
    render(<App />);

    fireEvent.press(screen.getByText("Sign in"));

    expect(await screen.findByText(/Welcome, Demo Buyer/i)).toBeTruthy();
    expect(await screen.findByText(/Wallet:/)).toBeTruthy();
  });

  it("shows an error for invalid credentials", async () => {
    render(<App />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "wrong@demo.dev",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "bad");
    fireEvent.press(screen.getByText("Sign in"));

    expect(screen.getByText("MangaMagnet Mobile")).toBeTruthy();
    expect(await screen.findByText(/Invalid credentials/i)).toBeTruthy();
  });
});
