# Kom igång med felix-ds i en webbapp

*Det här dokumentet finns också på engelska: [getting-started.en.md](getting-started.en.md).*

Detaljerna bakom [installationens tre alternativ](../README.md#installation-i-en-webbapp) i README står på den här sidan.

## Steg för steg

Alternativens steg i detalj: versionsvalet av FKUI-paketen, importposterna och SCSS-posterna när du vill kompilera själv.

### 1. Installera FKUI-paketen

Temat bygger på FKUI. Du väljer själv versionerna av FKUI-paketen och låser dem exakt i `package.json`. Bun och npm löser annars in peer-beroendet `@fkui/theme-default` automatiskt, mot senaste versionen i intervallet:

- Installera `@fkui/theme-default` med en version inom det stödda intervallet `>=6.57.0 <7.0.0`.
- Installera de andra FKUI-paketen du använder, till exempel `@fkui/design` och `@fkui/vue`, i samma version.

```bash
bun add --exact @fkui/theme-default@X.Y.Z @fkui/design@X.Y.Z @fkui/vue@X.Y.Z
```

Byt ut `X.Y.Z` mot den version du valt. Playgroundens egna lås står i repots `package.json` och visas i [vyn Kom igång](https://pattespatte.github.io/felix-ds/#/kom-igang).

Läs [avsnittet om kompatibilitet](#kompatibilitet) innan du skriver egen Sass som rör `@fkui/theme-default`.

### 2. Importera temat

Standardvägen är förbyggd CSS – den kräver ingen Sass. Importera en fil i appens startfil:

```ts
import "@pattespatte/felix-ds/dist/felix.css";
```

Filen innehåller `@font-face`, det ljusa temat på `:root` och det mörka temat på `html[data-color-mode="dark"]`. Vill du följa systeminställningen i stället för att styra färgläget själv finns `dist/felix-auto.css`. Paketets `main`-nyckel pekar på `dist/felix.css`, så den korta importen `import "@pattespatte/felix-ds"` fungerar också.

Vill du ha en enda import i stället för tre? Då finns `dist/felix-complete.css`. Den innehåller samma css som de här tre importerna, sammanfogade i samma ordning:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "@pattespatte/felix-ds/dist/felix.css";
```

Den här raden ger alltså samma resultat som de tre raderna ovan, och ersätter både steg 2 och steg 3:

```ts
import "@pattespatte/felix-ds/dist/felix-complete.css";
```

`felix-complete.css` är ett smidigt alternativ, men standardvägen är de tre importerna ovan. De håller temat litet: standardposterna väger cirka 5 kb gzippat. Paritetstestet har bytebudgetar som ser till att de inte växer i onödan – en ändring som gör en post tyngre måste vara värd sin vikt.

Varje post har dessutom ett minifierat syskon: `dist/felix.min.css`, `dist/felix-auto.min.css` och `dist/felix-complete.min.css` innehåller samma regler i komprimerad form, för användare som laddar posten som ren `<link>`-css utan byggkedja. Minifieringen läser in varje färdig post som ren css, så en syntaktiskt ogiltig post stoppar bygget i stället för att hamna i paketet.

Behöver du avgränsa temat till en egen selektor, till exempel för att växla tema i körtid? Då använder du SCSS-posterna i stället. Paketet pekar ut `src/index.scss` via nyckeln `sass`. Ett globalt tema:

```scss
@use "@pattespatte/felix-ds/src/index";
```

Körningsväxling med en klass – så här gör playgrounden:

```scss
@use "@pattespatte/felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // FKUI:s grundtema
}

html.theme-felix {
    @include felix.light; // grundtema + felix-variabler
}
```

### 3. Ladda FKUI:s komponent-CSS

Importera FKUI:s CSS i appens startfil:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

Du har nu temat på plats. En komplett genomgång finns i guiden [Skapa en webbplats med felix-ds](create-a-site.sv.md). Den tar upp projektsetup, temaintegration, mörkt läge, ikoner, formulär, sök och prerendering.

## Ikoner

Paketet skickar med en kurerad ikonuppsättning från [Phosphor Icons](https://phosphoricons.com) (MIT-licens) i vikten bold. Uppsättningen ersätter standardikonbibliotekets teckningar bakom FIcons oförändrade namn – varje namn ur `@fkui/icon-lib-default` täcks (även de sammansatta `info`, `warning` och `tooltip`), maskinkontrollerat av paritetstestet i `scripts/icons.test.ts`, plus en kurerad utökning. Ikonerna är SVG-sprites som följer textfärgen i det aktiva temat.

Byt ut standardbibliotekets import mot temats spritesheet i appens startfil – importera aldrig båda, eftersom dubbla `f-icon-*`-symbol-id:n löser sig till det blad som först hamnar i DOM:en:

```ts
import "@pattespatte/felix-ds/src/icons/phosphor-spritesheet";
```

FIcon används sedan som vanligt, till exempel `<f-icon name="house">`. Hela uppsättningen visas på [playgroundens ikonsida](https://pattespatte.github.io/felix-ds/#/knappar/ficon). Nästa mening vänder sig till dig som utvecklar själva felix-ds-paketet – använder du bara paketet behöver du inte läsa den. Spritesheetet är genererat: när du har ändrat mappningarna i `scripts/icons.ts` skapar du det på nytt med `bun run icons:build`.

## Mörkt läge

Temat har även en mörk profil. Den förbyggda `dist/felix.css` har båda lägena inbyggda – ljust på `:root`, mörkt på `html[data-color-mode="dark"]`. På SCSS-sidan skriver `src/index.scss` bara ut det ljusa temat; du slår på mörkt läge med mixins:

- `base` / `light` – uppströms ljusa tema utan respektive med felix-variablerna.
- `base-dark` / `dark` – samma par för mörkt läge (`base-dark` är FKUI:s eget mörka tema).
- `auto` – båda de sammansatta temana bakom `prefers-color-scheme`-mediefrågor. Använd den när du vill följa systeminställningen.

Vill du styra läget själv, med klass eller attribut i stället för mediefrågor? Gör så här:

```scss
@use "@pattespatte/felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // grundtema, ljust
}

html[data-color-mode="dark"] {
    @include felix.base-dark; // grundtema, mörkt
}

html.theme-felix {
    @include felix.light; // felix, ljust
}

html.theme-felix[data-color-mode="dark"] {
    @include felix.dark; // felix, mörkt
}
```

Varje scope skriver ut hela tokenytan. Specificitetssteget (`:root` < `html.theme-felix` / `html[data-color-mode="dark"]` < den kombinerade selektorn) löser alla kombinationer utan `!important`. Mixinerna sätter också `color-scheme` per läge, så att nativa kontroller och rullningslister följer med.

I playgrounden gör färglägesknappen (sol/måne) uppe till höger exakt detta. Den följer systeminställningen tills användaren väljer själv. Valet sparas då i `localStorage`.

## Design tokens i DTCG-format

Paketet skickar med tematokens som [W3C Design Tokens](https://design-tokens.github.io/community-group/) i utkastformatets JSON – två kompletta filer, en per färgläge:

- `@pattespatte/felix-ds/tokens/light.json` – det sammansatta temat i ljust läge
- `@pattespatte/felix-ds/tokens/dark.json` – det sammansatta temat i mörkt läge

”Sammansatt tema” är uppströms `@fkui/theme-default` plus felix-profilens överskrivningar, alltså exakt det som temats mixins skriver ut. Filerna genereras ur SCSS-källorna (i repot: `bun run tokens:build`) och paritetstestet (`bun test`) upptäcker filer som inte längre stämmer med temat. Formatet är verktygsneutralt och passar bland annat Tokens Studio och Style Dictionary. Importen är symmetrisk: `bun run tokens:import` läser valfri W3C DTCG-fil (till exempel en Figma-export) och skriver ut anpassade egenskaper, medan det handskrivna temat förblir den enda sanningskällan – se [docs/tokens.sv.md](tokens.sv.md).

Namngivning, aliaser, undantag och konsumtionsvägar finns i guiden [Design tokens](tokens.sv.md).

## Kompatibilitet

Temat har ett enda peer-beroende: `@fkui/theme-default` i intervallet `>=6.57.0 <7.0.0`. Intervallet gäller temalagret. Vi testar och stöder Sass-tokenytan i `@fkui/theme-default`, alltså de variabler som temats startfil laddar konfigurerat (`@use` i `src/theme/_default.scss`). Vi testar och stöder inte FKUI-komponenternas interna delar.

Övriga `@fkui/*`-paket (`@fkui/vue`, `@fkui/design` med flera) ingår inte i kontraktet. Du låser dem själv.

> [!WARNING]
> Låt aldrig din egen Sass ladda eller konfigurera `@fkui/theme-default`. Temats startfil laddar paketet redan konfigurerat. En andra konfigurerad `@use`-laddning krockar och bryter kompileringen.

Versionskontraktet – semantisk versionering av token och mixins, hur token och mixins fasas ut och vilka versioner som stöds – beskrivs i [Styrning och versionskontrakt](governance.sv.md). När token inte räcker till: kombinera det som redan finns i stället för att bygga wrappers. Beprövade recept finns i [Mönsterbiblioteket](patterns.sv.md).

## Exempel på implementering

- <https://pattespatte.github.io/felix-ds-demo-site/>
