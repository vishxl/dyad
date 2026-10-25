import { expect, it } from "vitest";
import { claudeTextFilter } from "./text";
it("never turns split model text into host action cards", () => {
  const filter = claudeTextFilter();
  const output =
    filter("Example: <nextbill") +
    filter('ion-write path="a">x</nextbillion-') +
    filter("write>", true);
  expect(output).toBe(
    'Example: &lt;nextbillion-write path="a">x&lt;/nextbillion-write>',
  );
});
it("also escapes the pre-rebrand tag dialect", () => {
  expect(claudeTextFilter()('<dyad-write path="a">x</dyad-write>', true)).toBe(
    '&lt;dyad-write path="a">x&lt;/dyad-write>',
  );
});
it("preserves ordinary source markup and only permits security findings in review mode", () => {
  expect(claudeTextFilter()("<div>source</div>", true)).toBe(
    "<div>source</div>",
  );
  const input =
    '<nextbillion-security-finding title="x">finding</nextbillion-security-finding>';
  expect(claudeTextFilter(true)(input, true)).toBe(input);
  expect(claudeTextFilter()(input, true)).not.toContain(
    "<nextbillion-security-finding",
  );
});
