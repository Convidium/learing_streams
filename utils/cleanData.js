import { stat, mkdir, rm } from "node:fs/promises";

const cleanData = async (dirPath) => {
    console.log(`Clearing data from ${dirPath}..`);
    const isDirectory = (await stat(dirPath)).isDirectory();

    try {
        await rm(dirPath, {
            recursive: true,
            force: true
        });

        if (isDirectory) {
            await mkdir(dirPath, {recursive: true});
            console.log(`Files in folder ${dirPath} were cleared succesfully.`);
        } else {
            console.log(`File ${dirPath} was cleared succesfully.`);
        }
    } catch (err) {
        console.log("Error: ", err.message)
    }
}

export default cleanData;