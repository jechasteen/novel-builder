# Novel Builder

Create novels using markdown.

## Prerequisites

* Pandoc
* Weasyprint
* Poppler
* BASH

## Getting Started

> Note: All `./nb` commands must be called from inside the `novel-builder` directory

1. Create a new repository.
2. Make a new directory `src/` and populate it with chapters. Chapters in the resulting documents will be ordered alphabetically, so make sure you name your files accordingly. E.g. `Chapter_01.md, Chapter_02.md, etc.`
3. Add this repository as a git submodule: `git submodule add https://github.com/jechasteen/novel-builder`
4. Call `./nb init` to customize your project. This runs a wizard that automatically fills in the templates with your project's info.
5. CSS and HTML files will be added to your `src/` directory. Customize these files to suit your needs.
6. Use the `nb` script to build and maintain your project
   1. `./nb manuscript` builds a submission-ready manuscript
   2. `./nb paperback` builds a paperback-formatted pdf (according to `src/css/paperback.css`). See [the @page documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@page) for more info.
   3. `./nb clean` removes the `build/` directory.
   4. `./nb wc` prints word count for each chapter and a grand total.

## Customization

Calling `./nb init` will customize files like title pages automatically. If you need to make changes, you can either edit the files individually, or go into your `src/` and remove the non-markdown files (`rm -r css/ html/`) and call `./nb init` again.

If you need to make styling changes, make the changes to the files that `nb` created in your `src/` directory.

Customization for distribution formats (paperback/epub) will necessarily require more customization.

## Keeping Up-to-date

To pull the latest git master of this module, call `git submodule update`.