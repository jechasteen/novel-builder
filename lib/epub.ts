import {
    constants,
    ensureDirsExist,
    getAbbrTitle,
    getSortedDocumentFilenamesArray,
    logBegin,
    pipeProcessOutputToLog,
    print,
} from "./mod.ts";

export function epub(): Promise<Deno.ProcessStatus> {
    print("Compiling EPUB...");
    logBegin("EPUB");

    ensureDirsExist();

    const title = getAbbrTitle();
    const outputFilename = `${constants.binDir}/${title}.epub`;
    const documents = getSortedDocumentFilenamesArray();

    const process = Deno.run({
        cmd: [
            "pandoc",
            "--verbose",
            `--metadata-file=${constants.metaYML}`,
            "-o",
            outputFilename,
            ...documents,
        ],
        stderr: "piped",
        stdout: "piped",
    });

    pipeProcessOutputToLog(process);
    return process.status();
}
