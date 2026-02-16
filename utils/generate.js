import fs from "node:fs";

const waitForDrain = (stream) => {
    return new Promise((resolve) => {
        stream.once("drain", resolve);
    })
}

const generateCSV = async (filePath, targetSizeBytes) => {
    console.log(`We start generating file: ${filePath} (${targetSizeBytes}) bytes..`);

    const writeStream = fs.createWriteStream(filePath);
    const header = "id,name,age,email\n";
    writeStream.write(header);

    let currentSizeBytes = Buffer.byteLength(header);
    let idCounter = 1;

    while (currentSizeBytes < targetSizeBytes) {
        const id = idCounter++;
        const name = `User_${id}`;
        const age = Math.random() * 99;
        const email = `user${id}@gmail.com`;

        const string = [id, name, age, email].join(",") + "\n";

        const canWrite = writeStream.write(string);

        if (!canWrite) {
            await waitForDrain(writeStream);
        }
        currentSizeBytes += Buffer.byteLength(string);
    }
    writeStream.end();

    await new Promise(resolve => {
        writeStream.on("finish", resolve);
    })

    console.log(`File at path: ${filePath} has been generated succesfully! Final size is: ${currentSizeBytes} bytes.`);
}

export default generateCSV;
