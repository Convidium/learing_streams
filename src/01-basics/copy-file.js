import fs from "node:fs"
import { pipeline } from "node:stream/promises";

const main = async () => {
    const readStream = fs.createReadStream("data/source.csv");
    const writeStream = fs.createWriteStream("data/output/source-copied.csv");

    try {
        await pipeline(
            readStream,
            writeStream
        )
    } catch (err) {
        console.log("There's an error:", err)
    }

    console.log("Stream ended");
}

main();