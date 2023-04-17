import {
    constants,
    getAbbrTitle,
    getSortedDocumentFilenamesArray,
    logBegin,
    pipeProcessOutputToLog,
    print,
processStatusCallback,
} from "./mod.ts";

export async function paperback() {
    print("Compiling Paperback...");
    logBegin("PAPERBACK");

    const title = getAbbrTitle();
    const filenames = {
        final: `${constants.binDir}/${title}-paperback.pdf`,
        htmlFrontmatter: constants.htmlFrontmatter,
        htmlText: `${constants.buildDir}/paperback.html`,
        pdfFrontmatter: `${constants.buildDir}/paperback_frontmatter.pdf`,
        pdfText: `${constants.buildDir}/paperback_text.pdf`,
    };

    // Convert the text to html
    const pandocTextToHTML = Deno.run({
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
    pipeProcessOutputToLog(pandocTextToHTML);
    const textPromise = pandocTextToHTML.status()
        .then((result) => {
            if (result.success) {
                const weasyprintTextToPDF = Deno.run({
                    cmd: [
                        "weasyprint",
                        filenames.htmlText,
                        filenames.pdfText,
                    ],
                    stderr: "piped",
                    stdout: "piped",
                });
                // weasyprintTextToPDF.status().then(() => weasyprintTextToPDF.close());
                pipeProcessOutputToLog(weasyprintTextToPDF);
            }
        });

    // Convert the frontmatter to pdf
    const weasyprintFrontmatter = Deno.run({
        cmd: [
            "weasyprint",
            filenames.htmlFrontmatter,
            filenames.pdfFrontmatter,
        ],
        stderr: "piped",
        stdout: "piped",
    });
    pipeProcessOutputToLog(weasyprintFrontmatter);

    await Promise.all([
        textPromise,
        weasyprintFrontmatter.status(),
        // weasyprintFrontmatter.output(),
    ]);

    // Combine the two pdf documents
    const pdfunite = Deno.run({
        cmd: [
            "pdfunite",
            filenames.pdfFrontmatter,
            filenames.pdfText,
            filenames.final,
        ],
        stderr: "piped",
        stdout: "piped",
    });
    pipeProcessOutputToLog(pdfunite);
    pdfunite.status().then(processStatusCallback);
}
