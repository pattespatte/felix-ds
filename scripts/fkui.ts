/**
 * Hjälpreda för projektets @fkui-beroenden (uppströms komponentramverk).
 *
 * Användning:
 *   bun run fkui version               visa specifierad, installerad och senaste version
 *   bun run fkui upgrade -n            torrkörning: visa uppgraderingsplanen, ändra inget
 *   bun run fkui upgrade               uppgradera till senaste version och kör bun install
 *   bun run fkui upgrade 6.58.0        som ovan, men till en vald version
 *
 * Konventioner som skriptet följer:
 * - samtliga @fkui-paket låses till exakta versioner (inga ^ eller ~)
 * - paketen uppgraderas i takt (samma version på alla), som uppströms publicerar dem
 * - länkar till release notes hämtas ur registrets metadata, inte hårdkodade här
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_JSON = resolve(ROOT, "package.json");
const REGISTRY = "https://registry.npmjs.org";

interface Packument {
    "dist-tags"?: Record<string, string>;
    versions?: Record<string, unknown>;
    time?: Record<string, string>;
    repository?: { url?: string } | string;
}

interface PackageRow {
    name: string;
    specifier: string;
    installed: string;
    latest: string;
}

function fail(message: string): never {
    console.error(`Fel: ${message}`);
    process.exit(1);
}

function readJson(path: string): Record<string, unknown> {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

/** Samlar ihop projektets @fkui-paket ur dependencies/devDependencies. */
function fkuiNames(pkg: Record<string, unknown>): string[] {
    const names: string[] = [];
    for (const section of ["dependencies", "devDependencies"]) {
        const deps = pkg[section];
        if (deps !== undefined && typeof deps === "object" && deps !== null) {
            for (const name of Object.keys(deps)) {
                if (name.startsWith("@fkui/") && !names.includes(name)) {
                    names.push(name);
                }
            }
        }
    }
    return names.sort();
}

/** Versionen som faktiskt ligger i node_modules, om den går att läsa. */
function installedVersion(name: string): string {
    const manifest = resolve(ROOT, "node_modules", name, "package.json");
    if (!existsSync(manifest)) {
        return "–";
    }
    const version = readJson(manifest)["version"];
    return typeof version === "string" ? version : "–";
}

async function fetchPackument(name: string): Promise<Packument> {
    const url = `${REGISTRY}/${encodeURIComponent(name)}`;
    const response = await fetch(url);
    if (!response.ok) {
        fail(`kunde inte hämta ${url} (HTTP ${response.status})`);
    }
    return (await response.json()) as Packument;
}

function releaseDate(packument: Packument, version: string): string {
    const time = packument.time?.[version];
    return time ? time.slice(0, 10) : "–";
}

/** Normaliserar registrets repository-url till en https-adress. */
function repositoryUrl(packument: Packument): string | null {
    const raw =
        typeof packument.repository === "string"
            ? packument.repository
            : packument.repository?.url;
    if (raw === undefined || raw === null) {
        return null;
    }
    return raw.replace(/^git\+/, "").replace(/\.git$/, "");
}

function parseVersion(version: string): [number, number, number] | null {
    const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
    return match
        ? [Number(match[1]), Number(match[2]), Number(match[3])]
        : null;
}

function bumpKind(from: string, to: string): string {
    const before = parseVersion(from);
    const after = parseVersion(to);
    if (before === null || after === null) {
        return from === to ? "oförändrad" : "annan";
    }
    if (before[0] !== after[0]) return "major";
    if (before[1] !== after[1]) return "minor";
    if (before[2] !== after[2]) return "patch";
    return "oförändrad";
}

function printTable(headers: string[], rows: string[][]): void {
    const widths = headers.map((header, column) =>
        Math.max(header.length, ...rows.map((row) => row[column].length)),
    );
    const line = (cells: string[]): string =>
        cells.map((cell, column) => cell.padEnd(widths[column])).join("  ").trimEnd();
    console.log(line(headers));
    for (const row of rows) {
        console.log(line(row));
    }
}

const usage = `Användning:
  bun run fkui version             visa specifierad, installerad och senaste version
  bun run fkui upgrade [-n] [version]
      -n, --dry-run                visa planen utan att ändra något
      version                      vald målversion i stället för senaste`;

async function runVersion(): Promise<void> {
    const pkg = readJson(PACKAGE_JSON);
    const names = fkuiNames(pkg);
    if (names.length === 0) {
        fail("inga @fkui-paket hittades i package.json");
    }
    const packuments = new Map<string, Packument>();
    await Promise.all(
        names.map(async (name) => {
            packuments.set(name, await fetchPackument(name));
        }),
    );

    const rows = names.map((name) => ({
        name,
        specifier: String((pkg.dependencies as Record<string, string>)[name]),
        installed: installedVersion(name),
        latest: packuments.get(name)?.["dist-tags"]?.latest ?? "–",
    }));
    printTable(
        ["Paket", "Specifierat", "Installerat", "Senaste"],
        rows.map((row) => [row.name, row.specifier, row.installed, row.latest]),
    );

    const specifiers = [...new Set(rows.map((row) => row.specifier))];
    const latest = [...new Set(rows.map((row) => row.latest))];
    const drift = rows.some((row) => row.installed !== row.specifier);
    if (drift) {
        console.log(
            "\nOBS: package.json och node_modules skiljer sig åt – kör `bun install`.",
        );
    }
    if (specifiers.length === 1 && latest.length === 1) {
        const [current] = specifiers;
        const [target] = latest;
        const date = releaseDate(packuments.get(rows[0].name)!, target);
        if (current === target) {
            console.log(
                `\nAktuellt: samtliga @fkui-paket står på ${current}, vilket också är senaste versionen.`,
            );
        } else {
            console.log(
                `\nUppgradering finns: ${current} → ${target} (utgiven ${date}).`,
            );
            console.log(
                "Kör `bun run fkui upgrade -n` för att se planen, `bun run fkui upgrade` för att genomföra.",
            );
        }
    } else {
        console.log(
            "\nPaketen står inte på samma version (varken här eller uppströms); kör `bun run fkui upgrade -n` för en plan.",
        );
    }
}

async function runUpgrade(
    requested: string | undefined,
    dryRun: boolean,
): Promise<void> {
    const pkg = readJson(PACKAGE_JSON);
    const names = fkuiNames(pkg);
    if (names.length === 0) {
        fail("inga @fkui-paket hittades i package.json");
    }
    const packuments = new Map<string, Packument>();
    await Promise.all(
        names.map(async (name) => {
            packuments.set(name, await fetchPackument(name));
        }),
    );

    let target: string;
    if (requested !== undefined) {
        const missing = names.filter(
            (name) => packuments.get(name)?.versions?.[requested] === undefined,
        );
        if (missing.length > 0) {
            fail(
                `versionen ${requested} finns inte för ${missing.join(", ")}`,
            );
        }
        target = requested;
    } else {
        const latest = [
            ...new Set(names.map((name) => packuments.get(name)?.["dist-tags"]?.latest)),
        ];
        if (latest.length === 1 && latest[0] !== undefined) {
            target = latest[0];
        } else {
            target = packuments.get("@fkui/vue")?.["dist-tags"]?.latest ?? "";
            console.log(
                "OBS: uppströms senaste versioner skiljer sig mellan paketen; målet sätts efter @fkui/vue.",
            );
        }
    }

    const rows = names.map((name) => ({
        name,
        current: String((pkg.dependencies as Record<string, string>)[name]),
    }));
    if (rows.every((row) => row.current === target)) {
        console.log(`Samtliga @fkui-paket står redan på ${target}. Inget att göra.`);
        return;
    }

    console.log(
        `Uppgraderingsplan ${target} (utgiven ${releaseDate(packuments.get("@fkui/vue")!, target)}):`,
    );
    printTable(
        ["Paket", "Nu", "Mål", "Steg"],
        rows.map((row) => [
            row.name,
            row.current,
            target,
            bumpKind(row.current, target),
        ]),
    );

    const repository = repositoryUrl(packuments.get("@fkui/vue")!);
    if (repository !== null) {
        console.log(`\nRelease notes: ${repository}/releases`);
    }
    if (rows.some((row) => bumpKind(row.current, target) === "major")) {
        console.log(
            "OBS: planen innefattar ett majorskifte – läs release notes noggrant innan uppgraderingen.",
        );
    }

    if (dryRun) {
        console.log(
            "\nTorr körning – inget har ändrats. En riktig körning hade skrivit exakta versioner i package.json och kört `bun install`.",
        );
        return;
    }

    for (const row of rows) {
        (pkg.dependencies as Record<string, string>)[row.name] = target;
    }
    writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`\npackage.json uppdaterad (exakta versioner: ${target}).`);

    const install = spawnSync("bun", ["install"], {
        cwd: ROOT,
        stdio: "inherit",
    });
    if (install.status !== 0) {
        fail("`bun install` misslyckades – kör om det för hand och undersök felet");
    }

    console.log(
        [
            "\nKlart. Följ upp med:",
            "  bun run build            # bygg playgrounden",
            "  bunx vue-tsc --noEmit    # typkontroll",
            "  bun run build:theme      # kompilera temalagret",
            "  bun run dev              # visuell runda i playgrounden",
        ].join("\n"),
    );
}

async function main(): Promise<void> {
    const [command = "version", ...rest] = process.argv.slice(2);
    const dryRun = rest.some((arg) => arg === "-n" || arg === "--dry-run");
    const requested = rest.find((arg) => !arg.startsWith("-"));

    switch (command) {
        case "version":
            await runVersion();
            break;
        case "upgrade":
            await runUpgrade(requested, dryRun);
            break;
        case "help":
        case "--help":
        case "-h":
            console.log(usage);
            break;
        default:
            console.error(`Okänt kommando: ${command}\n`);
            console.log(usage);
            process.exitCode = 1;
    }
}

await main();
