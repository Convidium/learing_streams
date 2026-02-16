import fs from "node:fs"
import { pipeline } from "node:stream/promises";
import generateCSV from "./utils/generate.js";
import cleanData from "./utils/cleanOutputData.js";

const main = async () => {
    // const readStream = fs.createReadStream("data/source.csv");
    // const writeStream = fs.createWriteStream("data/output/source-copied.csv");

    // try {
    //     await pipeline(
    //         readStream,
    //         writeStream
    //     )
    // } catch (err) {
    //     console.log("There's an error:", err)
    // }

    // console.log("Stream ended");
    // console.log(generateCSV("data/output/random.csv", (100 * 1024 * 1024).toString()));
    await cleanData("./data/output");
}

main();