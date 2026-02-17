import fs from "node:fs"
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const main = async () => {
    const readStream = fs.createReadStream("data/output/random.csv");
    const writeStream = fs.createWriteStream("data/output/clean.json");

    const csvToJSONTransformer = new Transform({
        readableObjectMode: true,
        writableObjectMode: true,

        construct(callback) {
            this.remainder = "",
            this.headers = null;
            this.isFirstObject = true;
            callback();
        },

        transform(chunk, encoding, callback) {
            const data = this.remainder + chunk.toString();
            const lines = data.split("\n");

            this.remainder = lines.pop();

            lines.forEach((line) => {
                const values = line.split(",");

                if (!this.headers) {
                    this.headers = values;
                    this.push("[\n");
                    return;
                }

                if (values.length === this.headers.length) {
                    const obj = {};
                    this.headers.forEach((header, index) => {
                        obj[header.trim()] = values[index].trim();
                    });

                    const jsonString = JSON.stringify(obj, null, 2);

                    if (this.isFirstObject) {
                        this.push('  ' + jsonString);
                        this.isFirstObject = false;
                    } else {
                        this.push(',\n  ' + jsonString);
                    }
                }
            });

            callback();
        },

        flush(callback) {
            this.push("\n]")
            callback();
        }
    });

    try {
        await pipeline(
            readStream,
            csvToJSONTransformer,
            writeStream
        );
    } catch (err) {
        console.log("Whoa! There's an error:", err);
    }

    console.log("Finished");
}

main();