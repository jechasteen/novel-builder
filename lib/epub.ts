import {
    constants,
    ensureDirsExist,
    getAbbrTitle,
    getSortedDocumentFilenamesArray,
    logBegin,
    pipeProcessOutputToLog,
    print,
processStatusCallback,
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
    process.status().then(processStatusCallback).then(() => process.close());
}
