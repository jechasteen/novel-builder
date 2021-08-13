# Novel Builder

Build novels using the [CTAN Novel Class](https://ctan.org/pkg/novel) with plain text files.

Output to PDF/X, EPUB, or double-spaced manuscript PDF.

## Dependencies

* LuaLaTeX
* Pandoc

## Usage

1. Start a new repo using this template.
2. Create a new project with `./nb book_directory new`
3. Edit `novel.sh`, `manuscript.yml`, and `epub.yml` to suit your project
4. Start writing your book inside of the new directory with the following rules:
   * Order the files by prefixing a number, eg. `0_Introduction.md` goes before `1_Chapter_One.md`
   * Start each file with level one title, e.g. `# Chapter One`
5. Use the `nb` script:
   * Parameter 1: directory containing project files (see `./example`)
   * Parameter 2: command to run
     * `novel` - a TEX and PDF ready to send to POD service.
     * `epub` - an EPUB formatted file.
     * `manuscript` - a double-spaced draft for revision
     * `all` - run all of the above commands concurrently
     * `new` - copies the example directory to the directory given in parameter 1
     * `wc` - count words per file and total wordcount for selected directory

> For example, `./nb example/ all`

## Limitations

There is no support for frontmatter like title pages, copyright, etc. (Yet?)

When preparing a manuscript, you have to manually edit the title and author fields in `manuscript.yml` under the section `header-includes`.

Unfortunately, it is necessary to manually edit settings for each output type.
I am considering creating a script that generates these files.
