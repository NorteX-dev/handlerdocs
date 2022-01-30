# Introduction

**@nortex/handler** is a simple and clean way of handling Discord.js commands, interactions and events.

It runs on [Discord.js](https://discord.js.org/) v13+.

Current version: `v4.0.3`.

## Why?

While the sole idea of handling commands, interactions, or events is quite simple in Discord.js, it can quite quickly become messy. That's why using a handler is very recommended, so you can split your commands, interactions and events into separate files, keeping your codebase clean.

@nortex/handler helps you do this faster and hastlefree with just a few lines of code.

Handlers are of course not required in the slightest, but having one thats sturdy and has customization is a nice developer experience improvement.

## Prerequisites

-   Discord.js v13.x
-   Node.js v16 (required by Discord.js 13)
-   NPM or Yarn
-   Editor/IDE of choice

## Installation

Run the following command to install the handler:

<code-group>
   <code-block title="YARN" active>
   ```bash
   yarn add @nortex/handler
   ```
   </code-block>

   <code-block title="NPM">
   ```bash
   npm install --save @nortex/handler
   ```
   </code-block>
</code-group>

...and require it in your code like so:

```js
const Handlers = require("@nortex/handler");
```

> Refer to the [API](/api) for a list of available classes, methods inside of them and their properties and types.
