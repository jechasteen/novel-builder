# Novel Builder

Build novels using the [CTAN Novel Class](https://ctan.org/pkg/novel) with plain text files.

## Dependencies

* LuaLaTeX
* Node JS and npm

## Usage

1. Start a new repo using this template.
2. Call `npm install` to install Node dependencies.
3. Copy `defaults.yml` to `metadata.yml` an edit according to your project
4. Start writing your book inside of `chapters/` with the following rules:
    * Start the file with a title, e.g. `# Chapter One`
    * Order the files by prefixing a number, eg. `01_Introduction.md` goes before `02_Chapter_One.md`
5. Build a `.tex` and `.pdf` file by calling `npm start`
6. Check your current word count by calling `npm test`

## Limitations

There is no support for frontmatter like title pages, copyright, etc.

Removing entries from `defaults.yml` may cause breakage where no defaults are given in the code.