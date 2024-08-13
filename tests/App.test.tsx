import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import App from "../src/App";
import React from "react";

describe("App", () => {
    it("renders homepage", () => {
        render(<App />);
        expect(
            screen.getByText("Welcome to RetroGame DB!")
        ).toBeInTheDocument();
    });

    it("renders header", () => {
        render(<App />);
        expect(screen.getByText("Platforms")).toBeInTheDocument();
        expect(screen.getByText("Genres")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("renders footer", async () => {
        render(<App />);
        const footerText = await screen.findByText(/created by tony hoong/i);

        expect(footerText).toBeInTheDocument();
    });
});
