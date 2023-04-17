// Re-exports library files

import { init } from "./init.ts";
import { wordCount } from "./wordCount.ts";
import { epub } from "./epub.ts";
import { paperback } from "./paperback.ts";
import { Path } from "https://deno.land/x/path@v3.0.0/mod.ts";
import { ensureDirSync } from "https://deno.land/std@0.183.0/fs/mod.ts";
import { mergeReadableStreams } from "https://deno.land/std@0.183.0/streams/merge_readable_streams.ts";

const print = console.log;

const constants = {
    buildDir: "../build",
    binDir: "../bin",
    metaJSON: "../meta.json",
    metaYML: "../epub.yml",
    logFilePath: "../build/build.log",
    htmlFrontmatter: "../src/html/paperback_frontmatter.html",
    cssPaperback: "../src/css/paperback.css",
};

function ensureDirsExist() {
    ensureDirSync(constants.buildDir);
    ensureDirSync(constants.binDir);
}

function logBegin(format: string) {
    logAppend(`\n[[${format}]] ${dateString()} ${timeString()}\n`);
}

function logAppend(message: string) {
    ensureDirsExist();
    Deno.writeTextFileSync(constants.logFilePath, message, {
        create: true,
        append: true,
    });
}

function pipeProcessOutputToLog(process: Deno.Process) {
    if (!process.stderr) {
        throw new Error("Error: process stderr was null!");
    }
    if (!process.stdout) {
        throw new Error("Error: process stdout was null!");
    }
    mergeReadableStreams(
        process.stdout.readable,
        process.stderr.readable,
    ).pipeTo(
        Deno.openSync(constants.logFilePath, { write: true, append: true })
            .writable,
    );
}

function processStatusCallback(result: Deno.ProcessStatus) {
    if (!result.success) {
        print(`FAILED! See ${constants.logFilePath} for more information.\n`);
    } else {
        print("Done!");
        logAppend("Finished successfully\n");
    }
}

function getAbbrTitle(): string {
    return JSON.parse(Deno.readTextFileSync(constants.metaJSON)).ABBR_TITLE;
}

function getSortedDocumentFilenamesArray(): string[] {
    {
        const result = [] as string[];
        for (const file of Deno.readDirSync("../src")) {
            if (!file.isDirectory && new Path(file.name).ext === ".md") {
                result.push(`../src/${file.name}`);
            }
        }
        return result.sort();
    }
}

function dateString(): string {
    return new Date().toLocaleDateString();
}

function timeString(): string {
    return new Date().toLocaleTimeString();
}

function sanitize(input: string): string {
    const strip = new RegExp('[~`!@#$%^&*()_=+[{]",}\\|;:"\',<.>/?]');
    return input.trim().replaceAll(/\s+/g, "").replace(strip, "");
}

export {
    constants,
    dateString,
    ensureDirsExist,
    epub,
    getAbbrTitle,
    getSortedDocumentFilenamesArray,
    init,
    logAppend,
    logBegin,
    paperback,
    Path,
    pipeProcessOutputToLog,
    print,
    processStatusCallback,
    sanitize,
    timeString,
    wordCount,
};
