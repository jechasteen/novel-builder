import { ensureDirSync } from "https://deno.land/std@0.183.0/fs/mod.ts";

import {
    print,
    sanitize
} from "./mod.ts"

function getMetadata(): Record<string, string> {
    function strPrompt(
        message: string,
        defaultValue?: string | undefined,
    ): string {
        return prompt(message, defaultValue) || "";
    }

    const currentYear = new Date().getFullYear().toString();
    let metadata: Record<string, string>;

    do {
        metadata = {
            TITLE: strPrompt("Title:"),
            ABBR_TITLE: strPrompt("Abbreviated Title:"),
            SUB: strPrompt("Subtitle (leave blank for none):"),
            AUTHOR: strPrompt("Author's Name:"),
            PEN: strPrompt("Pen Name (leave empty to use author's name):"),
            SURNAME: strPrompt("Author's surname (for manuscript header):"),
            COPYRIGHT: strPrompt(
                "Copyright Holder (leave empty to use author's name):",
            ),
            YEAR: strPrompt(
                `Copyright Year (leave blank to use ${currentYear}):`,
                currentYear,
            ),
            PUBLISHER: strPrompt("Publisher (leave blank for none):"),
            ADDR_1: strPrompt("Address (Line 1):"),
            ADDR_2: strPrompt("Address (Line 2):"),
            PHONE: strPrompt("Phone:"),
            EMAIL: strPrompt("Email:"),
            URL: strPrompt("URL:"),
        };
    } while (prompt("Everything Correct? (y/n)")?.toUpperCase() == "N");

    if (!metadata.PEN) metadata.PEN = metadata.AUTHOR;
    if (!metadata.COPYRIGHT) metadata.COPYRIGHT = metadata.AUTHOR;
    if (!metadata.PUBLISHER) metadata.PUBLISHER = metadata.AUTHOR;
    // Sanitize so that this value can be used for filenames.
    if (!metadata.ABBR_TITLE) {
        metadata.ABBR_TITLE = sanitize(metadata.AUTHOR);
    } else {
        metadata.ABBR_TITLE = sanitize(metadata.ABBR_TITLE);
    }

    return metadata;
}

function manuscriptTitleHTML(
    metadata: Record<string, string>,
): Promise<void> {
    let html = Deno.readTextFileSync("html/manuscript_title_template.html");
    for (const key in metadata) {
        html = html.replace(key, metadata[key]);
    }
    return Deno.writeTextFile("../src/html/manuscript_title.html", html);
}

function paperbackFrontmatterHTML(
    metadata: Record<string, string>,
): Promise<void> {
    let html = Deno.readTextFileSync("html/paperback_frontmatter.html");
    for (const key in metadata) {
        html = html.replace(key, metadata[key]);
    }
    return Deno.writeTextFile("../src/html/paperback_frontmatter.html", html);
}

function manuscriptCSS(surname: string, title: string): Promise<void> {
    return Deno.writeTextFile(
        "../src/css/manuscript.css",
        Deno.readTextFileSync("css/manuscript.css")
            .replace("SURNAME", surname.toUpperCase())
            .replace("TITLE", title),
    );
}

function paperbackCSS(author: string, title: string): Promise<void> {
    return Deno.writeTextFile(
        "../src/css/paperback.css",
        Deno.readTextFileSync("css/paperback.css")
            .replace("AUTHOR", author)
            .replace("TITLE", title),
    );
}

function metadataYML(metadata: Record<string, string>): Promise<void> {
    let yml = Deno.readTextFileSync("epub-template.yml");
    for (const key in metadata) {
        yml = yml.replace(key, metadata[key]);
    }
    return Deno.writeTextFile("../epub.yml", yml);
}

export function init() {
    ensureDirSync("../src/html");
    ensureDirSync("../src/css");

    const promises = new Array<Promise<void>>();

    print("Initializing new project\n\n");

    const metadata = getMetadata();

    Deno.writeTextFileSync("../meta.json", JSON.stringify(metadata));

    print("\n∘ Creating HTML Files...");
    print("  ↳ Manuscript title page");
    promises.push(
        manuscriptTitleHTML(metadata)
    );
    print("  ↳ Paperback frontmatter");
    promises.push(
        paperbackFrontmatterHTML(metadata)
    );

    print("∘ Creating CSS Files...");
    print("  ↳ Manuscript");
    promises.push(
        manuscriptCSS(metadata.SURNAME, metadata.TITLE)
    );
    print("  ↳ Paperback");
    promises.push(
        paperbackCSS(metadata.AUTHOR, metadata.TITLE)
    );

    print("∘ Copying additional files...");
    promises.push(
        Deno.copyFile(
            "css/manuscript_title.css",
            "../src/css/manuscript_title.css",
        ),
    );
    promises.push(
        Deno.copyFile(
            "css/paperback_frontmatter.css",
            "../src/css/paperback_frontmatter.css",
        ),
    );

    print("∘ Creating EPUB metadata file (epub.yml)...");
    promises.push(metadataYML(metadata));

    Promise.all(promises)
        .then(() => {
            print("\nDone!\n");
        })
        .catch((e) => {
            print(e);
        });
}
