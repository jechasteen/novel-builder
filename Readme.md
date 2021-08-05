# Novel Builder

Build novels using the [CTAN Novel Class](https://ctan.org/pkg/novel) with plain text files.

## Dependencies

* LuaLaTeX
* Node JS and npm

## Usage

1. Start a new repo using this template.
2. Call `npm install` to install Node dependencies.
3. Edit `defaults.yml` according to your needs
4. Start writing your book inside of chapters with the following rules:
   * Start the file with a title, e.g. `# Chapter One`
    * Order the files by prefixing a number, eg. `01_Introduction.md` goes before `02_Chapter_One.md`
5. Build a `.tex` and `.pdf` file by calling `npm run build`

## Limitations

At this time the markdown supported is minimal, limited to only one `#` at the start of the document.
This text is used as the title for that chapter.

Removing entries from `defaults.yml` may cause breakage where no defaults are given in the code.