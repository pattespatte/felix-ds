/**
 * Paritetstest för underlaget för tillgänglighetsredogörelser
 * (docs/accessibility-basis.{en,sv}.md).
 *
 * De committade dokumenten måste vara identiska med färsk generering ur
 * playgroundens tillgänglighetsdata (playground/src/accessibilityData.ts):
 * om en komponent läggs till, byter vy eller en vy byter titel fäller
 * testet tills `bun run accessibility:build` körts om. Mönstret är samma
 * som den förbyggda css:ens paritet. Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { BASIS_OUTPUTS, renderBasis } from "./accessibility-basis.ts";

describe("underlag tillgänglighetsredogörelse (docs)", () => {
    for (const lang of ["en", "sv"] as const) {
        test(`${BASIS_OUTPUTS[lang]} är identisk med färsk generering (inte föråldrad)`, () => {
            const committed = readFileSync(BASIS_OUTPUTS[lang], "utf8");
            const fresh = renderBasis()[lang];
            if (committed !== fresh) {
                throw new Error(
                    `${BASIS_OUTPUTS[lang]} är föråldrad – kör \`bun run accessibility:build\` och committa`,
                );
            }
        });
    }
});
