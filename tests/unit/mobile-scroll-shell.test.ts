import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

describe("mobile document shell", () => {
  it("prevents elastic scrolling past the document edges", () => {
    expect(css).toMatch(/html\s*\{[^}]*overscroll-behavior-y\s*:\s*none/s);
  });

  it("keeps the fixed navigation clearance inside the footer instead of after the body", () => {
    expect(css).toMatch(/@media\s*\(max-width:850px\)[\s\S]*?body\s*\{[^}]*padding-bottom\s*:\s*0/s);
    expect(css).toMatch(/@media\s*\(max-width:850px\)[\s\S]*?\.site-footer\s*\{[^}]*padding-bottom\s*:\s*calc\(64px\s*\+\s*env\(safe-area-inset-bottom\)\)/s);
  });
});
