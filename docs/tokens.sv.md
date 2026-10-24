# Design tokens i DTCG-format

*Det här dokumentet finns också på engelska: [tokens.en.md](tokens.en.md).*

felix-ds skickar med temats token som JSON i [W3C Design Tokens](https://design-tokens.github.io/community-group/) utkastformat (DTCG). Det gör temats token läsbara för verktyg utanför CSS-världen – bland annat Tokens Studio (Figma), Style Dictionary och dokumentationsgeneratorer – utan att något kopieras för hand.

## Filerna

Paketet innehåller två kompletta filer, en per färgläge:

- `@pattespatte/felix-ds/tokens/light.json`
- `@pattespatte/felix-ds/tokens/dark.json`

Varje fil är självbärande och innehåller det **sammansatta temat** i sitt läge: uppströms `@fkui/theme-default` plus felix-profilens överskrivningar, alltså exakt de värden som temats mixins skriver ut (se README:s avsnitt om [mörkt läge](https://github.com/pattespatte/felix-ds#m%C3%B6rkt-l%C3%A4ge)). Delade token (typografi, linjer, skuggor) finns i båda filerna. Filerna committas i repot och skickas med npm-paketet.

## Formatet

Filerna följer DTCG-utkastet: token är objekt med `$value` samt valfria `$type` och `$description`, grupper är objekt utan `$value`. Följande typer används:

| `$type` | Exempel |
| --- | --- |
| `color` | `#081130`, `rgba(0, 0, 0, 0.8)` |
| `dimension` | `3rem`, `1px`, `100%` |
| `duration` | `100ms` |
| `number` | `400` (typografisk vikt), `1.5` (radhöjd) |
| `fontFamily` | `["Noto Sans", "system-ui", "sans-serif"]` |
| `shadow` | skuggobjekt, se [Undantag och avvikelser](#undantag-och-avvikelser) |

DTCG är fortfarande ett utkast. Filerna är giltiga enligt utkastet i skrivande stund, men formatet kan komma att ändras uppströms.

## Namngivning och gruppering

CSS-variabelnamnet avspeglas mekaniskt: namnet utan inledande `--` delas på bindestreck och blir en nästad sökväg, och omvänt slås sökvägens delar ihop med bindestreck:

- `--fkds-color-action-text-primary-default` → `fkds.color.action.text.primary.default`
- `--f-font-size-xxx-large` → `f.font.size.xxx.large`
- `f.font.size.xxx.large` → `--f-font-size-xxx-large`

När ett tokennamn är äkta prefix av ett annat (`--f-font-family` före `--f-font-family-code`) kan namnet inte samtidigt vara blad och grupp – DTCG-konsumenter ser då undergrupperna som osynliga extraegenskaper. Kortnamnet läggs därför under det reserverade segmentet `_self` (namnförrådet innehåller aldrig understreck, så regeln är entydig i båda riktningarna):

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

Alla alias löses inom samma fil.

## Undantag och avvikelser

Exporten speglar temat 1:1 utom följande, som alla är dokumenterade beslut:

1. **Logoplatshållarna `--f-logo-image-small`/`--f-logo-image-large`** ingår inte. Deras `url()`-data-URI:er har ingen naturlig DTCG-typ. De når konsumenterna som vanligt via CSS-variablerna.
2. **`--fkui-theme-default-version`** ingår inte. Det är upstream-paketets versionsmetadata, ingen designtoken.
3. **26 token saknar `$type`.** Deras värden är sammansatta CSS-kortformer eller nyckelord utan DTCG-motsvarighet: rubrikfärgerna (`f.text.color.heading.1`–`6`, värdet `inherit`), knapparnas återställda paddingar (`initial`), animationskurvan `ease-out`, flerdelade marginaler/storlekar (t.ex. `padding.input.fields`, `f.modal.close.button.margin`), transition-kortformerna (`f.animation.expand.open`/`close`) samt `none` på egenskaper som inte är skuggor (`f.button.discrete.radius.hover`, `f.modal.close.button.padding`). `$value` är det exakta CSS-värdet. `$type` är medvetet utelämnat i stället för att lura till en felaktig typ. En strikt DTCG-validerare flaggar dem som varningar (saknad `$type`) – väntat och dokumenterat.
4. **`"none"`-skuggor behålls.** Profilen är helt platt, så skuggtoken med värdet `none` (`f.button.shadow` med deltoken, `f.box.modal.shadow`, `f.input.shadow.inset`) skrivs som `$type: "shadow"` med `$value: "none"` – att ta bort dem skulle dölja ett designbeslut. En strikt validerare flaggar själva värdet (väntat varningsmeddelande). Konsumenter som inte kan tolka `"none"` kan hoppa över just dessa token.

## Konsumera tokens

**Som JSON** (Node/Bun, villkorlig lösning av aliaser är enkel):

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

**I Tokens Studio:** importera filen som tokenuppsättning (DTCG-format).

## Generering och paritet

Filerna genereras av `scripts/tokens.ts`:

```bash
bun run tokens:build
```

Skriptet kompilerar båda färglägena ur SCSS-källorna och typar varje värde. Filerna är committade, och `bun test` (paritetstestet) misslyckas om de inte stämmer med färskt kompilerad CSS: samma namnmängd, samma värden, giltig struktur, lösta aliaser och inte föråldrade. Efter en FKUI-uppgradering: kör `bun run fkui upgrade` och därefter `bun run tokens:build`, och granska diffen – nya token dyker då upp, och ändrade upstream-värden sprider sig till exporten.

## Importera tokens

Riktningen är symmetrisk: `scripts/tokens-import.ts` läser valfri W3C DTCG-fil och skriver ut anpassade CSS-egenskaper. Den typiska källan är en export från ett designverktyg – till exempel Figma-plugin som talar DTCG – så att designerns tokenuppsättning blir en överskrivningsfil utan att något kopieras för hand:

```bash
bun run tokens:import -- design-tokens.json
bun run tokens:import -- design-tokens.json --out src/tokens.css
```

Omfattningen är enbart det egna felix-temats variabler – samma yta som exporten beskriver. Grundtemat undantas med avsikt: dess värden lever omodifierade i `@fkui/design`:s css, så det finns ingen felix-ds-källa som en import kan återskapa, och det ändras bara när FKUI-paketen bumpas.

Utdata är deterministiskt: ett `:root`-block, deklarationer sorterade efter namn, 2 mellanslag indrag och avslutande radbrytning. Aliaser skrivs som `var(--mål)`-referenser, så den genererade filen refererar till token i stället för att duplicera dem. Namnmappningen är den mekaniska inversen av exportens (se [Namngivning och gruppering](#namngivning-och-gruppering)).

Valideringen är strikt, och varje fel namnger den felande tokensökvägen:

- de stödda `$type`-värdena är `color`, `dimension`, `number`, `duration`, `fontFamily` och `shadow` – allt annat (t.ex. `gradient` eller `typography`) avvisas, eftersom felix-tokenmodellen inte kan uttrycka det
- token utan `$type` accepteras (sammansatta kortformer, som exportens otypade token)
- varje alias `{sökväg}` måste lösa sig till ett token i samma fil, och aliascykler avvisas
- blandnoder (ett token med underordnade grupper), tomma grupper, okända `$`-nycklar och krockande css-namn avvisas

Importen skriver aldrig till temats egna SCSS-källor – det handskrivna temat förblir den enda sanningskällan, och importen är skrivskyddad mot sin indatafil. Rundturen bevisas av `bun test`: att importera de committade `tokens/light.json` och `tokens/dark.json` kompilerar tillbaka till exakt det sammansatta temats deklarationer. En dokumenterad asymmetri: exporten strök citattecken ur typsnittsnamn, så fontlistor jämförs kanoniskt i stället för byte för byte, och återutgivna filer återger värdesemantiken – inte originalets citeringsval.
