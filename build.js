const fs = require("fs")
const path = require("path")
const exec = require("child_process").exec
const fields = require("./fields")
const y = require("yaml")
const pandoc = require("node-pandoc")

const buildHeader = (config) => {
    let header = fields.documentclass

    for (let i = 0; i < fields.headerFields.length; i++) {
        let currentTable = fields[fields.headerFields[i]]
        for (let key in currentTable) {
            header += currentTable[key](config[fields.headerFields[i]][key]) + "\n"
        }
    }

    return header
}

const buildContent = (content) => {
    let res = ""
    for (let key in content) {
        res += content[key] + '\n'
    }
    return res
}

async function getLatexPartial(markdown) {
    const args = "-f markdown -t latex"
    return new Promise((resolve, reject) => {
        pandoc(markdown, args, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

    // Build
; (async function() {
    if (!fs.existsSync(path.join(__dirname, "metadata.yml"))) {
        console.log("Build Failed: Please copy defaults.yml to metatadata.yml and edit to suit your project.")
        process.exit(1)
    }
    const config = y.parse(fs.readFileSync(path.join(__dirname, "metadata.yml"), { encoding: "utf-8" }))
    const chapters = fs.readdirSync(path.join(__dirname, "chapters"))
    const content = {}
    let document = ""
    for (let i = 0; i < chapters.length; i++) {
        let currentChapter = fs.readFileSync(
            path.join(__dirname, "chapters", chapters[i]),
            { encoding: "utf-8" },
        )
        currentChapter = currentChapter.split('\n')
        for (let line = 0; line < currentChapter.length; line++) {
            let title
            // TODO Support \ChapterDeco
            if (currentChapter[line].match(/^# .+/g)) {
                title = currentChapter[line].replace("# ", "")
                currentChapter.splice(line, line + 1)
                const latex = await getLatexPartial(currentChapter.join("\n"))
                content[chapters[i]] = fields.chapter(title, config.chapterStyle.recto, latex)
                break
            }
        }
    }
    
    document += buildHeader(config) + "\n"
    document += fields.document.wrapper(buildContent(content))
    if (!fs.existsSync(path.join(__dirname, config.build))) {
        fs.mkdirSync(path.join(__dirname, config.build), { recursive: true })
    }
    fs.writeFileSync(path.join(__dirname, config.build, config.tex_filename), document)

    exec(`lualatex --output-directory=${path.join(__dirname, config.build)} ${path.join(__dirname, config.build, config.tex_filename)}`, (err, stdout, stderr) => {
        if (err) throw err
        if (stdout) console.log(stdout)
        if (stderr) console.log(stderr)
    })
})()
