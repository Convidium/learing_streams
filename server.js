import fastify from "fastify";
import fs, { read } from "node:fs"
import path, { delimiter } from "node:path"
import { pipeline } from "node:stream/promises";
import csv from "csvtojson";
import { Transform } from "node:stream";

// 1. First implementation

/* This approach is not perfect. In this particular case, it works fine, since our readStream and writeStream have exact same characteristics. 
They can process same amount of data, so there's no problem with so called "backpressuring". 
But if we read from SSD, and write to HDD, our HDD can't process the incoming chunks of data as fast as an SSD sends it, so there is a problem? */

/* createReadStream creates a "bridge" between a file, or any other space of disk memory, and the RAM. By default, the size of allocated RAM space is 64KB.
readStream.on() allows us to transfer data from disk space to RAM, by tansfering data, split at "chunks". Each chunk is put at exactly the allocated RAM space,
until a certain operation is done at it, so the garbage collector can put it away (delete it?). 
In our case, we log the buffer into the console, and then send that buffer to writeStream pipe. 
*/

/* createWriteStream does bascally the same thing, but it creates a bridge from RAM to disk space, that we select, when creating this pipe.
We recieve buffer from a memory, and send it to be written at certain disk space. For that we use writeStream.write().

The issues occur, when writeStream writes data slower than the readStream recieves it and sends it to writeStream.
If readStream sends buffer chunk to writeStream, but it is still busy with the previous chunk - it leaves it in RAM, 
and so we now have a waitlist of buffer chunks to be sent via writeStream (highWaterMark).
And what happens if we read from a file way faster than we write to the other file? And the initial file size is way larger than what RAM could contain?
Well, as we place chunk and another chunk in RAM, at some point or RAM is full of chunks. We now don't have a place to store it in memory.
This is Heap out of Memory error.  
*/

// const main = async () => {
//     const readStream = fs.createReadStream("./test/customers.csv");

//     const writeStream = fs.createWriteStream("./test/exported-customers.csv");

//     readStream.on("data", (buffer) => {
//         console.log("Data:\n", buffer.toString())

//         writeStream.write(buffer)
//     })

//     readStream.on("end", () => {
//         console.log("Stream ended");

//         writeStream.end();
//     })
// }





/* 
This is a better way to work with streams, but again - not perfect. Now, while our writeStream is busy,
we stop recieving chunks of data from our readStream. So now we solved a problem of heap running out of memory.

But there's another problem. Error handling. With this approach, we can't really handle errors that occur within our pipes, 
since it doesn't pass them through. There's a workaround, we can just write a scenario for each case, but that's going to take a lot of code.
(See Cleanup Logic) 
*/

/* 
UPD. I actually added .pipe this time. Same functionality, but less code - .pipe() does all of that on its own. 
But the problem with error handling remains. 
*/

// 2. Second Implementation

const main = async () => {
    const readStream = fs.createReadStream("./test/customers.csv");
    const writeStream = fs.createWriteStream("./test/exported-customers.csv");

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