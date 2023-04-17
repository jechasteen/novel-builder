import {
    constants,
    getAbbrTitle,
    getSortedDocumentFilenamesArray,
    logBegin,
    pipeProcessOutputToLog,
    print,
} from "./mod.ts";

let filenames: Record<string, string>;

function generatePromise(success: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        resolve(success);
    });
}

async function handleProcessCompletion(process: Deno.Process): Promise<boolean> {
    const [status, stdout, stderr] = await Promise.all([
        process.status(),
        process.output(),
        process.stderrOutput()
    ]);
    process.close();

    return generatePromise(status.success);
}

async function pandocTextToHTML(): Promise<boolean> {
    const process = Deno.run({
        cmd: [
            "pandoc",
            "--verbose",
            "--standalone",
            "-f",
            "markdown",
            "-t",
            "html",
            "-c",
            constants.cssPaperback,
            ...getSortedDocumentFilenamesArray(),
            "-o",
            filenames.htmlText,
        ],
        stderr: "piped",
        stdout: "piped",
    });

    pipeProcessOutputToLog(process);

    return await handleProcessCompletion(process);
}

async function weasyprintTextToPDF(): Promise<boolean> {
    const process = Deno.run({
        cmd: [
            "weasyprint",
            filenames.htmlText,
            filenames.pdfText,
        ],
        stderr: "piped",
        stdout: "piped",
    });
    pipeProcessOutputToLog(process);

    return await handleProcessCompletion(process);
}

async function weasyprintFrontmatter(): Promise<boolean> {
    const process = Deno.run({
        cmd: [
            "weasyprint",
            filenames.htmlFrontmatter,
            filenames.pdfFrontmatter,
        ],
        stderr: "piped",
        stdout: "piped",
    });
    pipeProcessOutputToLog(process);

    return await handleProcessCompletion(process);
}

async function combineDocuments(): Promise<boolean> {
    const process = Deno.run({
        cmd: [
            "pdfunite",
            filenames.pdfFrontmatter,
            filenames.pdfText,
            filenames.final,
        ],
        stderr: "piped",
        stdout: "piped",
    });
    pipeProcessOutputToLog(process);

    return await handleProcessCompletion(process);
}



export async function paperback(): Promise<boolean> {
    print("Compiling Paperback...");
    logBegin("PAPERBACK");

    const title = getAbbrTitle();
    filenames = {
        final: `${constants.binDir}/${title}-paperback.pdf`,
        htmlFrontmatter: constants.htmlFrontmatter,
        htmlText: `${constants.buildDir}/paperback.html`,
        pdfFrontmatter: `${constants.buildDir}/paperback_frontmatter.pdf`,
        pdfText: `${constants.buildDir}/paperback_text.pdf`,
    };

    // Convert the text to html
    if (!(await pandocTextToHTML())) return generatePromise(false);

    // convert text to pdf
    if (!(await weasyprintTextToPDF())) return generatePromise(false);

    // convert frontmatter to pdf
    if (!(await weasyprintFrontmatter())) return generatePromise(false);
    
    // combine documents
    if (!(await combineDocuments())) return generatePromise(false);
    return generatePromise(true);
}