import { execFileSync } from "node:child_process";

if (process.platform !== "darwin") {
  console.log(
    `Skipping nextbillion-keychain-reader rebuild on ${process.platform}; it is macOS-only.`,
  );
  process.exit(0);
}

execFileSync("npm", ["rebuild", "nextbillion-keychain-reader"], {
  stdio: "inherit",
});
