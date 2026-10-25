import { parse } from "@babel/parser";
import MagicString from "magic-string";
import path from "node:path";
import { walk } from "estree-walker";
import type { Plugin } from "vite";

const VALID_EXTENSIONS = new Set([".jsx", ".tsx"]);

/** Adds data-nextbillion-id / data-nextbillion-name to every JSX element in dev. */
export default function nextBillionTagger(): Plugin {
  return {
    name: "vite-plugin-nextbillion-tagger",
    apply: "serve",
    enforce: "pre",

    async transform(code: string, id: string) {
      try {
        if (
          !VALID_EXTENSIONS.has(path.extname(id)) ||
          id.includes("node_modules")
        )
          return null;

        const ast = parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });

        const ms = new MagicString(code);
        const fileRelative = path.relative(process.cwd(), id);

        walk(ast as any, {
          enter(node: any) {
            try {
              if (node.type !== "JSXOpeningElement") return;
              if (node.name?.type !== "JSXIdentifier") return;
              const tagName = node.name.name as string;
              if (!tagName) return;

              const alreadyTagged = node.attributes?.some(
                (attr: any) =>
                  attr.type === "JSXAttribute" &&
                  attr.name?.name === "data-nextbillion-id",
              );
              if (alreadyTagged) return;

              const loc = node.loc?.start;
              if (!loc) return;
              const tagId = `${fileRelative}:${loc.line}:${loc.column}`;

              if (node.name.end != null) {
                ms.appendLeft(
                  node.name.end,
                  ` data-nextbillion-id="${tagId}" data-nextbillion-name="${tagName}"`,
                );
              }
            } catch (error) {
              console.warn(
                `[nextbillion-tagger] Warning: Failed to process JSX node in ${id}:`,
                error,
              );
            }
          },
        });

        if (ms.toString() === code) return null;

        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true }),
        };
      } catch (error) {
        console.warn(
          `[nextbillion-tagger] Warning: Failed to transform ${id}:`,
          error,
        );
        return null;
      }
    },
  };
}
