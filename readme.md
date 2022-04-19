# YingYang

Ying yang is a simple discord.js command handler, it has support for default commands, events, built in command handler and so much more + more planned!


```bash
npm i yingyang
```

---

### Example:

This example below is an example of it in Javascript as ts types are currently in the works!

```js
const YingYang = require("yingyang");
require("dotenv").config();

const client = new YingYang({
  commandDirectory: `example/commands`, // Your commands directory ( starts from the process cwd )
  eventDirectory: `example/events`, // Your events directory ( starts from the process cwd )
  addDefaultCommands: true, // Add built in commands
  mongoConnection: process.env.MONGODB, // Mongodb URI
  defaultPrefix: "!" // A command prefix
});

client.start({ token: process.env.TOKEN }); // Login the client
```


#### Command Example:

```js
const { Command } = require("yingyang");

module.exports = new Command({
    name: `ping`,
    description: `ping command`,
    category: "misc",
    aliases: ["p"],
    execute: async ({ ctx, client }) => {
        ctx.reply({ content: `${client.ws.ping}ms`})
    }
})
```