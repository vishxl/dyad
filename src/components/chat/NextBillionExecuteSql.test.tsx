import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NextBillionExecuteSql } from "./NextBillionExecuteSql";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        changesDatabaseSchema: "Changes database schema",
        destructiveDataChange: "Destructive data change",
      })[key] ?? key,
  }),
}));

describe("NextBillionExecuteSql", () => {
  it("shows a schema mutation indicator for DDL", () => {
    render(
      <NextBillionExecuteSql>
        CREATE TABLE users (id bigint);
      </NextBillionExecuteSql>,
    );

    expect(screen.getByText("Changes database schema")).toBeTruthy();
  });

  it("extracts SQL text from string children mixed with React nodes", () => {
    render(
      <NextBillionExecuteSql>
        {"CREATE "}
        <span>ignored</span>
        {"TABLE users (id bigint);"}
      </NextBillionExecuteSql>,
    );

    expect(screen.getByText("Changes database schema")).toBeTruthy();
  });

  it("omits the schema mutation indicator for ordinary queries", () => {
    render(<NextBillionExecuteSql>SELECT * FROM users;</NextBillionExecuteSql>);

    expect(screen.queryByText("Changes database schema")).toBeNull();
  });

  it("shows a destructive data indicator for deletes", () => {
    render(
      <NextBillionExecuteSql>
        DELETE FROM users WHERE id = 1;
      </NextBillionExecuteSql>,
    );

    expect(screen.getByText("Destructive data change")).toBeTruthy();
  });
});
