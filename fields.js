module.exports = pub = {};

pub.headerFields = [
    "metadata",
    "dimensions",
    "fonts",
    "headerFooter",
    "chapterStyle",
    "other"
]

pub.documentclass = "\\documentclass{novel}\n"

pub.metadata = {
    title: s => `\\SetTitle{${s}}`,
    subtitle: s => `\\SetSubtitle{${s}}`,
    author: s => `\\SetAuthor{${s}}`,
    application: s => `\\SetApplication{${s || "LuaLaTeX with novel and microtype"}}`,
    producer: s => `\\SetProducer{${s || "LuaLaTeX with novel-pdfx and hyperref"}}`,
    PDFX: o => `\\SetPDFX[${o ? o.outputIntent : "CGATSTR001"}]{${o ? o.complianceStandard : "X-1a:2001"}}`,
}

pub.dimensions = {
    trimSize: (obj) => `\\SetTrimSize{${obj.w}}{${obj.h}}`,
    margins: (obj) => `\\SetMargins{${obj.top}}{${obj.outer}}{${obj.bottom}}{${obj.inner}}`,
}

pub.fonts = {
    parentFont: s => {
        return `\\SetParentFont[
SmallCapsFeatures={Renderer=Basic},
Kerning=On,
Ligatures=TeX,
]{${s}}`
    },
    decoFont: s => `\\SetDecoFont{${s}}`,
    sansFont: s => `\\setsansfont{${s}}`,
    monoFont: s => `\\setmonofont{${s}}`,
    mathFont: s => `\\setmathfont{${s}}`,
}

pub.headerFooter = {
    headFootStyle: n => `\\SetHeadFootStyle{${n || 1}}`,
    headJump: n => `\\SetHeadJump{${n || 1.5}}`,
    footJump: n => `\\SetFootJump{${n || 1.5}}`,
    looseHead: n => `\\SetLooseHead{${n || 50}}`,
    // Placed in between the page number and the binding
    emblems: (obj) => `\\SetEmblems{${obj.verso}}{${obj.recto}}`,
    // TODO
    // pub.headerFooter.headFont
    // pass no argument to get only page number
    // otherwise pre and post go before and after the page number
    // e.g. pre = "-- ", post = " --" would result in "-- 1 --"
    pageNumberStyle: (obj) => `\\SetPageNumberStyle{${obj.pre}\\thepage${obj.post}}`,
    versoHeadText: s => `\\SetVersoHeadText{${s || "\\theAuthor"}}`,
    rectoHeadText: s => `\\SetRectoHeadText{${s || "\\theTitle"}}`,
}

pub.chapterStyle = {
    chapterStartStyle: s => `\\SetChapterStartStyle{${s || "footer"}}`,
    chapterStartHeight: n => `\\SetChapterStartHeight{${n || 10}}`,
    // TODO
    // pub.chapters.font
    // pub.chapters.subFont
    sceneBreakIndent: b => `\\SetScenebreakIndent{${b ? "true" : "false"}}`
}


// UNCATEGORIZED
pub.other = {
    defaultLanguage: (obj) => `\\setdefaultlanguage${obj.variant ? "[variant=" + obj.variant + "]" : ""}{${obj.lang}}`,
    microtype: (obj) => `\\microtypesetup{config=${obj.config || "novel-microtype"},stretch=${obj.stretch || 20},shrink=${obj.shrink || 20},final}`
}

pub.document = {
    wrapper: (inner) => {
        return `
\\begin{document}
${inner}
\\end{document}
`
    },
    frontmatterStart: () => "\\frontmatter",
    mainmatterStart: () => `\\mainmatter`
}

// Front Matter Pages
// TODO

/**
 * Build a chapter using a template string
 * @param {String} title - The chapter's main heading
 * @param {Boolean} recto - Clear to new right-hand page if true, otherwise just next page
 * @param {String} body - The chapter's text, including any subtitles found
 */
pub.chapter = (title, recto, body) => {
    return `
\\begin{ChapterStart}
\\ChapterTitle{${title}}
\\end{ChapterStart}
${body}
${recto ? "\\cleartorecto" : "\\clearpage"}
`
}