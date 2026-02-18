import fs from "node:fs"
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const main = async () => {
    const readStream = fs.createReadStream("data/output/random.csv");
    const writeStream = fs.createWriteStream("data/output/clean.json");

    const csvToObjectStream = new Transform({
        readableObjectMode: true,
        writableObjectMode: true,

        construct(callback) {
            this.remainder = "";
            this.headers = null;
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
                    return;
                }

                if (values.length === this.headers.length) {
                    const obj = {};
                    this.headers.forEach((header, index) => {
                        obj[header.trim()] = values[index].trim();
                    });

                    this.push(obj);
                }
            });
            callback();
        }
    });

    const ageFilterStream = new Transform({
        readableObjectMode: true,
        writableObjectMode: true,

        construct(callback) {
            this.minAge = 18;
            callback();
        },

        transform(user, encoding, callback) {
            const userAge = parseInt(user.age);
            if (userAge >= this.minAge) {
                this.push(user);
            }
            callback();
        }
    });

    const JSONStringifyStream = new Transform({
        readableObjectMode: true,
        writableObjectMode: true,

        construct(callback) {
            this.isFirstObject = true;
            callback();
        },

        transform(user, encoding, callback) {
            const jsonString = JSON.stringify(user, null, 2);
                    if (this.isFirstObject) {
                        this.push('[\n  ' + jsonString);
                        this.isFirstObject = false;
                    } else {
                        this.push(',\n  ' + jsonString);
                    }
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
            csvToObjectStream,
            ageFilterStream,
            JSONStringifyStream,
            writeStream
        );
    } catch (err) {
        console.log("Whoa! There's an error:", err);
    }

    console.log("Finished");
}

main();