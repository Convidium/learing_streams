import { mkdir, rm } from "node:fs/promises";

const cleanData = async (dirPath) => {
    console.log(`Clearing data from ${dirPath}..`);

    try {
        await rm(dirPath, {
            recursive: true,
            force: true
        });

        await mkdir(dirPath, {recursive: true});
        
        console.log(`Files in folder ${dirPath} were cleared succesfully`);
    } catch (err) {
        console.log("Error: ", err.message)
    }
}

export default cleanData;