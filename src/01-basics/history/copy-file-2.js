import fs from "node:fs"

const main = async () => {
    const readStream = fs.createReadStream("data/source.csv");
    const writeStream = fs.createWriteStream("data/output/source-copied.csv");

    readStream.on("error", (err) => {
        console.error("Error: ", err.message);
        writeStream.end();
    })

    writeStream.on("error", (err) => {
        console.error("Error: ", err.message);
        readStream.end();
    })

    readStream.pipe(writeStream)
}

main();