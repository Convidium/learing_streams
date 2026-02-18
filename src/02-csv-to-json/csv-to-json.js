import fs from "node:fs"
import { pipeline } from "node:stream/promises";
import { csvToObjectStream, ageFilterStream, JSONStringifyStream } from "./custom-streams.js";

const main = async () => {
    const INPUT = "data/output/random.csv";
    const OUTPUT = "data/output/clean.json";

    const readStream = fs.createReadStream(INPUT);
    const writeStream = fs.createWriteStream(OUTPUT);

    try {
        await pipeline(
            readStream,
            csvToObjectStream,
            ageFilterStream,
            JSONStringifyStream,
            writeStream
        );

        console.log("Finished succesfully!");
    } catch (err) {
        console.log("Critical error detected:");

        if (err.code == "EACCES") {
            console.error("Problem with file access. A file could not be modified.");
        } else if (err.code == "ENOENT") {
            console.error("Folder doesn't exist.");
        } else {
            console.error("Unknown error.");
        }
    }
}

main();