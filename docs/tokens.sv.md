# Design tokens i DTCG-format

*Det här dokumentet finns också på engelska: [tokens.en.md](tokens.en.md).*

felix-ds skickar med tematokens som JSON i [W3C Design Tokens](https://design-tokens.github.io/community-group/) utkastformat (DTCG). Det gör tematokens läsbara för verktyg utanför CSS-världen – bland annat Tokens Studio (Figma), Style Dictionary och dokumentationsgeneratorer – utan att något kopieras för hand.

## Filerna

Paketet innehåller två kompletta filer, en per färgläge:

- `@pattespatte/felix-ds/tokens/light.json`
- `@pattespatte/felix-ds/tokens/dark.json`

Varje fil är självbärande och innehåller det **sammansatta temat** i sitt läge: uppströms `@fkui/theme-default` plus felix-profilens överskrivningar, alltså exakt de värden som temats mixins skriver ut (se README:s avsnitt om [mörkt läge](https://github.com/pattespatte/felix-ds#m%C3%B6rkt-l%C3%A4ge)). Delade token (typografi, border, skuggor) finns i båda filerna. Filerna committas i repot och skickas med npm-paketet.

## Formatet

Filerna följer DTCG-utkastet: token är objekt med `$value` och valfri `$type` och `$description`, grupper är objekt utan `$value`. Följande typer används:

| `$type` | Exempel |
| --- | --- |
| `color` | `#081130`, `rgba(0, 0, 0, 0.8)` |
| `dimension` | `3rem`, `1px`, `100%` |
| `duration` | `100ms` |
| `number` | `400` (typografisk vikt), `1.5` (radhöjd) |
| `fontFamily` | `["Noto Sans", "system-ui", "sans-serif"]` |
| `shadow` | skuggobjekt, se [Undantag och avvikelser](#undantag-och-avvikelser) |

DTCG är fortfarande ett utkast; filerna är giltiga enligt utkastet i skrivande stund men formatet kan komma att ändras uppströms.

## Namngivning och gruppering

CSS-variabelnamnet avspeglas mekaniskt: namnet utan inledande `--` delas på bindestreck och blir en nästad sökväg, och tvärtom slås sökvägens delar ihop med bindestreck:

- `--fkds-color-action-text-primary-default` → `fkds.color.action.text.primary.default`
- `--f-font-size-xxx-large` → `f.font.size.xxx.large`
- `f.font.size.xxx.large` → `--f-font-size-xxx-large`

När ett tokennamn är äkta prefix av ett annat (`--f-font-family` före `--f-font-family-code`) kan namnet inte samtidigt vara blad och grupp – DTCG-konsumenter ser då undergrupperna som osynliga extraegenskaper. Kortnamnet bogseras därför under det reserverade segmentet `_self` (namnförrådet innehåller aldrig understreck, så regeln är entydig i båda riktningarna):

```json
"warning": {
    "_self": {
        "$type": "color",
        "$value": "#fff3c6"
    },
    "strong": {
        "$type": "color",
        "$value": "#ffc108"
    }
}
```

Det motsvarar `--fkds-color-feedback-background-warning` och `--fkds-color-feedback-background-warning-strong`. Rundturen är mekanisk: segmenten fogas samman med bindestreck och `_self` stryks. Nio token berörs (typsnittsfamiljen, knappskuggan med deltoken, de fem `strong`-varianterna och fokusringens färger).

## Aliasreferenser

Token som i CSS:t pekar på en annan token uttrycks som DTCG-alias `{sökväg}` (utan dollartecken – `$` är förbehållet egenskapsnamn som `$value`):

- `--f-page-layout-background` → `"{fkds.color.background.tertiary}"` (båda lägena)
- `--f-color-focus` → `"{fkds.focus.indicator.color._self}"`
- `--f-tooltip-border-width` → `"{f.border.width.medium}"`
- Fokusindikatorns skugga är sammansatt av två ringar vars färger är alias: `"{fkds.focus.indicator.color.background}"` och `"{fkds.focus.indicator.color._self}"`.

Alla alias löser sig inom samma fil.

## Undantag och avvikelser

Exporten speglar temat 1:1 utom följande, som alla är dokumenterade beslut:

1. **Logoplatshållarna `--f-logo-image-small`/`--f-logo-image-large`** ingår inte. Deras `url()`-data-URI:er har ingen naturlig DTCG-typ. De når konsumenterna som vanligt via CSS-variablerna.
2. **`--fkui-theme-default-version`** ingår inte. Det är upstream-paketets versionsmetadata, ingen designtoken.
3. **26 token saknar `$type`.** Deras värden är sammansatta CSS-kortformer eller nyckelord utan DTCG-motsvarighet: rubrikfärgerna (`f.text.color.heading.1`–`6`, värdet `inherit`), knapparnas återställda paddingar (`initial`), animationskurvan `ease-out`, flerdelade marginaler/storlekar (t.ex. `padding.input.fields`, `f.modal.close.button.margin`), transition-kortformerna (`f.animation.expand.open`/`close`) samt `none` på egenskaper som inte är skuggor (`f.button.discrete.radius.hover`, `f.modal.close.button.padding`). `$value` är det exakta CSS-värdet; `$type` är medvetet utelämnat i stället för att lura till en fel typ. En strikt DTCG-validerare flaggar dem som varningar (saknad `$type`) – väntat och dokumenterat.
4. **`"none"`-skuggor behålls.** Profilen är helt platt, så skuggtoken med värdet `none` (`f.button.shadow` med deltoken, `f.box.modal.shadow`, `f.input.shadow.inset`) skrivs som `$type: "shadow"` med `$value: "none"` – att ta bort dem skulle dölja ett designbeslut. En strikt validerare flaggar själva värdet (väntat varningsmeddelande); konsumenter som inte kan tolka `"none"` kan hoppa över just dessa token.

## Konsumera tokens

**Som JSON** (Node/Bun, villkorlig resolvers av aliaser är enkel):

```ts
import light from "@pattespatte/felix-ds/tokens/light.json";

const primary = light.fkds.color.text.primary.$value; // "#081130"
```

**Med Style Dictionary** (illustration, inte en del av paketet):

```js
export default {
    source: ["node_modules/@pattespatte/felix-ds/tokens/light.json"],
    platforms: {
        css: {
            transformGroup: "css",
            files: [{ destination: "tokens.css", format: "css/variables" }],
        },
    },
};
```

**I Tokens Studio:** importera filen som token-uppsättning (DTCG-format).

## Generering och paritet

Filerna genereras av `scripts/tokens.ts`:

```bash
bun run tokens:build
```

Skriptet kompilerar båda färglägena ur SCSS-källorna och typar varje värde. Filerna är committade, och `bun test` (paritetstesten) fäller dem om de inte stämmer med färskt kompilerad CSS: samma namnmängd, samma värden, giltig struktur, lösta aliaser och inte föråldrade. Efter en FKUI-uppgradering: kör `bun run fkui upgrade` och därefter `bun run tokens:build`, och granska diffen – nya token dyker då upp, och ändrade upstream-värden sprider sig till exporten.
