## This folder is dedicated mainly for the use of `Transform` class ##

I played around with how to use the `Transform` class here in this file.
The puprose of this pipeline is simple:

- It takes our randomly generated `random.csv` file, reads data from it.
- Converts string lines into __'key-value'__ objects.
- Filters out entries with age less than __18__.
- Converts the object to a __JSON__ object.
- Writes this database to `clean.json` and adds basic formatting for better look.
- Wraps it in square braces `[]`.

Now I can use `Transform` streams properly, know how they work, why they're used, etc.
I've had a little practice with it (tbh I quite liked it, and I found the whole idea of streams to be a very cool and genius thing).