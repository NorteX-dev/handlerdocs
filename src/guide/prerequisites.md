# Prerequisites

Before using the handler, make sure you have the prerequisites complete first.

If you have a discord.js bot ready already, you can skip this.

> Note: This is a very brief explanation of creating a discord bot. Please refer to other sources for help with creating a discord bot.

## JavaScript knowledge

This guide assumes you have at least a basic knowledge of JavaScript with NodeJS. If not, refer to other sources first.

## Initializing the project

To start, initialize a new project using `yarn` or `npm` like so:

<code-group>
<code-block title="YARN" active>

```bash
yarn init
```

   </code-block>

   <code-block title="NPM">
   ```bash
   npm init
   ```
   </code-block>
</code-group>

Proceed by answering the questions to fill `package.json`.

## Discord.JS Bot

To add a handler, you will need a `client` object of `discord.js`. If you haven't yet, you can install discord.js with:

<code-group>
   <code-block title="YARN" active>
   ```bash
   yarn add discord.js
   ```
   </code-block>

   <code-block title="NPM">
   ```bash
   npm install --save discord.js
   ```
   </code-block>
</code-group>

Then, to initialize the Discord.JS Client, inside `index.js` write:

```js
// Require Discord.js' Client class, as well as the Intents class
const { Client, Intents } = require("discord.js");
// Initialize the client
const client = new Client({ Intents.FLAGS.GUILDS, /*add more if needed*/ });

// Now we have `client` available in our disposal.

// Listen to the "ready" event and log when the bot is ready.
client.on("ready", () => {
   console.log("The bot is ready!");
});

// Login the bot with your token from the Discord Developer Portal
// Note: This should always be your last line in the index.js
client.login(process.env.TOKEN || "YOUR-TOKEN-HERE");
```

You can run this code from the terminal by using:

```bash
node index.js
```

With a discord bot ready, you can proceed.
