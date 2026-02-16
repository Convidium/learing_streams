import fs from "node:fs"

const main = async () => {
    const readStream = fs.createReadStream("data/source.csv");
    const writeStream = fs.createWriteStream("data/output/source-copied.csv");

    readStream.on("data", (buffer) => {
        console.log("Data:\n", buffer.toString())

        writeStream.write(buffer)
    })

    readStream.on("end", () => {
        console.log("Stream ended");

        writeStream.end();
    })
}

main();