# Novel Builder

Build novels using the [CTAN Novel Class](https://ctan.org/pkg/novel) with plain text files.

## Dependencies

* LuaLaTeX
* Node JS and npm
* Pandoc

## Usage

1. Start a new repo using this template.
2. Run `npm install`
3. Edit `novel.yml`, `manuscript.yml`, `epub.yml` to suit your project
4. Start writing your book inside of `chapters/` with the following rules:
    * Start each file with a chapter title, e.g. `# Chapter One` (technically optional)
    * Order the files by prefixing a number, eg. `01_Introduction.md` goes before `02_Chapter_One.md`
5. Run `npm run novel` to build `.tex` and `.pdf` files with the novel document class.
6. Run `npm run manuscript` to build a manuscript-formatted `.pdf`.
7. Check your current word count by calling `npm test`

## Limitations

There is no support for frontmatter like title pages, copyright, etc.

Removing entries from YAML files may cause breakage where no defaults are given in the code.

When preparing a manuscript, you have to manually edit the title and author fields in `manuscript.yml` under the section `header-includes`.

Unfortunately, I haven't yet figured out a way to join YAML files, so it is necessary to edit one for each output type.
I am considering creating a script that generates these files.
