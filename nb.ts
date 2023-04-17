#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --allow-write --allow-run

// TODO: The async doesn't work properly. The "Done!" message doesn't come paired
//       with its corresponding "Compiling"

const VERSION = "3.0.0";

import { posix } from "https://deno.land/std@0.183.0/path/mod.ts";

// local imports
import {
    constants,
    epub,
    init,
    paperback,
    print,
    wordCount,
} from "./lib/mod.ts";

function usage() {
    print(`
Usage: ${posix.basename(Deno.mainModule)} [OPTION or COMMAND]

OPTIONs:
    -h, --help      Print this help message and exit
    -v, --version   Print version and exit

COMMAND must be one of:
    init            Configure a new project.
    clean           Remove build directory.
    wc              Print the word count for each chapter, a grand total, and estimated reading time
    all             Build all formats
    manuscript      \\
    paperback       - Build only selected output format
    epub            /
    `);
}

function notifyProcessResult(result: boolean, target: string) {
    if (result) {
        print(`${target} finished successfully!`);
    } else {
        print(
            `${target} compilation failed! See ${constants.logFilePath} for details.`,
        );
    }
}

async function main() {
    print(`Novel Builder v${VERSION}\n`);
    if (posix.basename(Deno.env.get("PWD") || "") !== "novel-builder") {
        print(
            "[Error] Novel Builder script must be run from inside its own directory.",
        );
        Deno.exit(1);
    }
    if (Deno.args.length != 1) {
        usage();
    }
    const arg = Deno.args[0];
    switch (arg) {
        case "-h":
        case "--help":
            usage();
            Deno.exit();
            break;
        case "-v":
        case "--version":
            print(`novel-builder v${VERSION}`);
            Deno.exit();
            break;
        case "init":
            init();
            break;
        case "all": // falls through
        // deno-lint-ignore no-case-declarations
        case "paperback":
            const stepResult = await paperback();
            if (stepResult) {
                print("Paperback finished successfully!");
            } else {
                print(`Paperback compilation failed. See ${constants.logFilePath} for more info.`);
            }
            if (arg == "paperback") break; // falls through
        case "epub":
            notifyProcessResult((await epub()).success, "EPUB");
            if (arg === "epub") break;
            if (arg === "all") break; // falls through
        case "wc":
            wordCount();
            break;
        default:
            usage();
            Deno.exit(1);
    }
}

if (import.meta.main) main();
