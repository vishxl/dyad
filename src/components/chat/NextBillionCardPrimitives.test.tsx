import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  NextBillionCard,
  NextBillionStateIndicator,
} from "./NextBillionCardPrimitives";

describe("NextBillionCard", () => {
  it("lifts the card surface on hover in dark mode", () => {
    render(<NextBillionCard data-testid="card">Content</NextBillionCard>);

    const card = screen.getByTestId("card");
    expect(card.className).toContain("dark:bg-(--background-lighter)");
    expect(card.className).toContain("dark:hover:bg-muted/50");
  });
});

describe("NextBillionStateIndicator", () => {
  it("renders warning state with an amber indicator", () => {
    const { container } = render(
      <NextBillionStateIndicator
        state="warning"
        warningLabel="Needs attention"
      />,
    );

    expect(screen.getByText("Needs attention")).toBeTruthy();
    expect(container.querySelector(".text-amber-600")).toBeTruthy();
  });
});
