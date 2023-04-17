import { print, Path } from "./mod.ts";

const WPM = 250;

class Time {
    hours: number;
    minutes: number;

    constructor(hours: number, minutes: number) {
        this.hours = hours;
        this.minutes = minutes;
    }

    toString() {
        if (this.hours === 0) {
            return `${this.minutes}m`;
        } else {
            return `${this.hours}h ${this.minutes}m`;
        }
    }
}

function estimateReadingTime(nWords: number): Time {
    const totalTimeSeconds = Math.round(nWords / WPM);
    const hours = Math.trunc(totalTimeSeconds / 60);
    const minutes = totalTimeSeconds % 60;
    return new Time(hours, minutes);
}

export function wordCount() {
    print("Word Count:");
    let total = 0;
    let filenames = [];
    for (const doc of Deno.readDirSync("../src")) {
        if (!doc.isDirectory && new Path(doc.name).ext === ".md") {
            filenames.push(doc.name);
        }
    }
    filenames = filenames.sort();

    for (const i in filenames) {
        const content = Deno.readTextFileSync("../src/" + filenames[i]);
        const current = content
            .split(/\s/g)
            .filter((word) => word.length > 0)
            .length;
        print(
            `\t${
                filenames[i].replace(".md", "")
            }:\t\t${current.toLocaleString()}\t\t${
                estimateReadingTime(current).toString()
            }`,
        );
        total += current;
    }
    print(`\n\tGrand Total:\t\t${total} words`);
    print(`\tReading Time:\t\t${estimateReadingTime(total).toString()}`);
}
