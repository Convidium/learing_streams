## 1. First implementation ##

Can be found in file `history/copy-file-1.js`

This approach is not perfect. In this particular case, it works fine, since our `readStream` and `writeStream` have exact same characteristics.
They can process same amount of data, so there's no problem with so called *"backpressuring"*.
But if we read from SSD, and write to HDD, our HDD can't process the incoming chunks of data as fast as an SSD sends it, so there is a problem?

createReadStream creates a "bridge" between a file, or any other space of disk memory, and the RAM. By default, the size of allocated RAM space is 64KB.
`readStream.on()` allows us to transfer data from disk space to RAM, by tansfering data, split at "chunks". Each chunk is put at exactly the allocated RAM space,
until a certain operation is done at it, so the garbage collector can put it away (delete it?).
In our case, we log the buffer into the console, and then send that buffer to writeStream pipe. 


`createWriteStream` does bascally the same thing, but it creates a bridge from RAM to disk space, that we select, when creating this pipe.
We recieve buffer from a memory, and send it to be written at certain disk space. For that we use `writeStream.write()`.

The issues occur, when `writeStream` writes data slower than the `readStream` recieves it and sends it to `writeStream`.
If `readStream` sends buffer chunk to `writeStream`, but it is still busy with the previous chunk - it leaves it in RAM,
and so we now have a waitlist of buffer chunks to be sent via `writeStream` (__highWaterMark__).
And what happens if we read from a file way faster than we write to the other file? And the initial file size is way larger than what RAM could contain?
Well, as we place chunk and another chunk in RAM, at some point or RAM is full of chunks. We now don't have a place to store it in memory.
This is Heap out of Memory error.  



## 2. Second implementation: using `.pipe()` ##

Can be found in file `history/copy-file-2.js`

This is a better way to work with streams, but again - not perfect. Now, while our `writeStream` is busy,
we stop recieving chunks of data from our `readStream`. So now we solved a problem of heap running out of memory.

But there's another problem. Error handling. With this approach, we can't really handle errors that occur within our pipes, 
since it doesn't pass them through. There's a workaround, we can just write a scenario for each case, but that's going to take a lot of code.
(See __Cleanup Logic__) 

__UPD.__ I actually added .pipe this time. Same functionality, but less code - `.pipe()` does all of that on its own. 
But the problem with error handling remains. 



## 3. Third (Final) implementation: using `.pipeline()` ##

So apparently, this is the best approach. We handle errors, and we regulate the pressure that's been put ot readStream, writeStream.
`.pipeline()` does everything for us, This is the standart practice for current Node.js version. Using `.pipeline()` instead of `.pipe()` is strongly advised.