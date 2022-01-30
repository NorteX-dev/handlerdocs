# Classic Command Handler

## Introduction to classic command handlers

With our "boilerplate" code ready - which initializes and logs in the discord client - we can start.

If you get stuck anywhere in this guide, you can always look up the complete code in this [GitHub repo](https://github.com/NorteX-dev/handler-guide-examples).

## Definition

A "Command Handler" or more specifically what we call a "classic command handler" is a handler for handling messages like `?help`, `!ban @user` or `;;lookup @user`. They support aliases, categorizing, custom user and bot permissions, cooldowns, and more (refer to the [API](/api) for a full list of [CommandOptions](/api/CommandOptions.html)).

This handler does **not** handle slash commands, context menus, or any events in of itself. You should read [Interaction Handling](/guide/basic-interaction-handler.html) and [Event Handling](/guide/basic-event-handler.html) for more information about these two.

## Before we begin

To understand how the handler works, we must first understand the command execution flow.

-   The `CommandHandler` constructor loads the commands from files to a `commandHandler.commands` [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
-   The bot then receives the `messageCreate` event and runs `commandHandler.runCommand(message)` which validates conditions and runs the command.
-   Handling responding to the command inside the `run()` function.

## Setting up the handler

First of all, make sure you have the **message intent** enabled inside your client constructor.

It is worth mentioning that in the future (if you're reading this later, it's likely to be like that already) guild messages content intent will be **privilaged**. This means that you have to explicitely enable it in your [Discord Developer Portal](https://discordapp.com/developers/applications/) for it to work. On top of that, veryfing the bot for it to go above 100 guilds will require you to provide how you utilize this message content and if you store it - where and how can users request deletion of this data. Because of this fact, we recommend using slash commands for making commands instead which is a more Discord-friendly version of receiving commands.

```js
const { Client, Intents } = require("discord.js");
// Require the `CommandHandler` class from the handler package
const { CommandHandler } = require("@nortex/handler");
 // Add "Intents.FLAGS.GUILD_MESSAGES" to receive message events ⬇️
const client = new Client({ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES });

client.on("ready", () => {
   console.log("The bot is ready!");
});

// Initialize the CommandHandler class and assign it to `commandHandler`.
const commandHandler = new CommandHandler({
    client, // The client instance
    directory: path.join(__dirname, "./commands/"), // An **absolute** path to where to look for command files
    prefix: "?", // The prefix to use for commands (you can change this during execution later - refer to "Creating dynamic prefix")
});

// Listen to events if you want to. These are all completely optional and you can omit this step.
commandHandler.on("error", console.error); // Note this does not include execution errors, like missing permissions or cooldown errors.
commandHandler.on("debug", console.log); // Logs additional debug info to console.
commandHandler.on("load", command => {
    // Emits on every command load with the Command object which contains things like name, description, cateogory etc.
    console.log(`Loaded command: ${command.name}`);
})

client.login(process.env.TOKEN || "YOUR-TOKEN-HERE");
```

With the above code you can start creating command files inside your `commands` directory. To learn how to do that, go to [Creating Commands](/guide/creating-commands.html) for more information.

## Creating a minimal command

To create your first command, the first step is to have a file inside your `commands` (or anything that you specified in the handler) directory. The name of that file does not matter but for organisation reasons, it should be the name of the command you're creating.

> File name will be inherited as the command name if the `name` option is not provided inside the `super()` method.

Inside that file, we create a new class that extends the [Command](/api/Command.html) class, call the `super()` method inside the constructor passing in all the parameters we get in the constructor and a fourth parameter which will be our [CommandOptions](/api/CommandOptions.md). Additionally, we then export it with `module.exports`.

You can do that with:

```js
const Command = require("@nortex/handler");

// Create the class and extend it with `Command`
class MyCommand extends Command {
	// Set up a constructor method on the class
	constructor(handler, client, fileName) {
		// Call super() with all the parameters
		super(handler, client, fileName, {
			// Options
			name: "my-command", // The name of the command
			description: "My command description", // The description of the command
			category: "my-category", // The category of the command
		});
	}

	// You can also use the spread operator for shorter code:
	// constructor(...args) {
	// 	super(...args, { options });
	// }

	// Override the run method inside the `Command` class with a custom one
	async run(message, args, ...props) {
		// The `run()` method is where you place the code for your command.

		// Here we reply to the message with the first argument
		message.reply(`Hello, ${args[0]}!`);
	}
}

module.exports = MyCommand;
```

Inside the `run()` method:

-   `message` contains the message object, from which you can get stuff like `author`, `channel`, `guild`, etc., or call `send()`, `reply()`.
-   `args` is an array of strings, which contains words provided after the command like `?command arg1 arg2`
-   `props` is the custom params you pass into `runCommand()` - this is explained more throughly in [Using custom run() method props](/guide/custom-props.html)

Since you're using an extended class, you also can use:

-   `this.client` is the client instance
-   `this.handler` is the command handler instance

> All `options` are totally optional but recommended for organisation sake.
>
> If no `options` object is provided though, the name will be inherited from the file name, description will be an empty string (?), category will be 'Miscelaneous' and aliases will be an empty array (i.e. no aliases).

## Executing the command

By now, the command will get loaded into memory correctly. But it won't get executed since we are not receiving the `messageCreate` event. So, let's make it!

Back in our `index.js` file, let's create a `messageCreate` event with the `message` param (make sure you do it after creating the handler but before `client.login()`):

> Later on you can combine this with the [EventHandler](/guide/basic-event-handler.html).

```js
client.on("messageCreate", (message) => {});
```

Inside the event, we can utilize the `handler.runCommand()` method to **run the command**. Running the command validates multiple conditions, like permissions, cooldowns and considers aliases and other. It takes in the `message` param we get from the event. The `runCommand()` method will return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which will resolve when the command is executed, or throw an error if execution errors occur, like missing permissions.

> Keep in mind the promise resolves right when the `run()` method is called, **not** when all asynchronous tasks (API requests, collectors, callbacks, timeouts) in that method are finished.

```js
client.on("messageCreate", (message) => {
	commandHandler
		.runCommand(message)
		.then((command) => {
			// Command ran successfully, `command` contains the executed command object
		})
		.catch((error) => {
			// Command failed to run, `error` contains information about the execution error
		});
});
```

If you do not `.catch()` the promise, the error will be thrown and the bot will crash at each time a command fails, so catching is a necessity.

> [Warning] Usually, what you will want to do is send the error back to the user with `message.reply(error.message)`. However, errors will also be thrown when no "command" part of the message is available (only the prefix is present in the message) or when a command was not found. If you don't want to inform the user about this, check for the appropriate [command error codes](/api/CommandExecutionError.md) with an `if` clause. You should also do tbat to provide custom error messages.

## Summary

After doing all of these steps, the commands should be loading and the bot should execute the code inside `run()` upon executing `<prefix><command-name> [args]`, like `?my-command John`.

**Congratulations!** You have just made a command handler.

### Final code:

`index.js`

```js
const { Client, Intents } = require("discord.js");
const { CommandHandler } = require("@nortex/handler");
const client = new Client({ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES });

client.on("ready", () => {
   console.log("The bot is ready!");
});

const commandHandler = new CommandHandler({
    client,
    directory: path.join(__dirname, "./commands/"),
    prefix: "?",
});

commandHandler.on("error", console.error);
commandHandler.on("debug", console.log);
commandHandler.on("load", command => {
    console.log(`Loaded command: ${command.name}`);
});

client.on("messageCreate", (message) => {
	commandHandler
		.runCommand(message)
		.catch((error) => {
			message.reply(error.message);
		});
});

client.login(process.env.TOKEN || "YOUR-TOKEN-HERE");
```

`commands/mycommand.js`

```js
const Command = require("@nortex/handler");

class MyCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: "my-command",
			description: "My command description",
			category: "my-category",
		});
	}

	async run(message, args, ...props) {
		message.reply(`Hello, ${args[0]}!`);
	}
}

module.exports = MyCommand;
```

From here, you can refer to [CommandOptions](/api/CommandOptions.html) for a list of all available command options and use the handler fully.
