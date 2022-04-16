import { Client, ClientEvents, ClientOptions, Collection } from "discord.js";
import { EventEmitter } from "stream";
import { Connection } from "mongoose";
import { ClientOptions as clientOptions } from "../typings/index";
import { CommandInterface } from "../typings/Commands";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Event";
import { Logger } from "../utils/Logger";
import chalk from "chalk";
import connect from "../schemas/connect";

const globPromise = promisify(glob);

const importFile = async (filePath: string) => {
  return (await import(filePath))?.default;
};

export interface defaultCommands {
  help: string;
  ping: string;
  prefix: string;
}

class YingYang extends Client {
  public Client: Client;
  public Options: clientOptions;
  clientOptions: ClientOptions = {
    intents: 32767,
    allowedMentions: { repliedUser: false },
    partials: [
      "REACTION",
      "CHANNEL",
      "GUILD_MEMBER",
      "GUILD_SCHEDULED_EVENT",
      "USER",
      "MESSAGE",
    ],
  };

  public commands: Collection<string, CommandInterface> = new Collection();
  constructor(Config: clientOptions) {
    super({
      intents: 32767,
      allowedMentions: { repliedUser: false },
      partials: [
        "REACTION",
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "USER",
        "MESSAGE",
      ],
    });
    this["Options"] = Config;
    this["Client"] = this;
  }

  start(options: { token: string }) {
    if (!options.token) {
      throw new Error(`[YingYang] Please supply a discord bot token!`);
    }
    this.login(options.token);
    this.ClientSetup();
  }
  private async ClientSetup() {
    const options = this.Options;
    if (options.defaultPrefix === "") {
      throw new Error("[YingYang] Please make sure to supply a valid prefix!");
    }
    if (!options.commandDirectory) {
      throw new Error(`[YingYang] Please supply a valid commands directory!`);
    }
    if (!options.eventDirectory) {
      throw new Error(`[YingYang] Please supply a valid events directory!`);
    }
    if (options.commandDirectory.endsWith("/")) {
      throw new Error(
        '[YingYang] Please make sure your command directory doesnt end with a "/"! Example: `src/commands`'
      );
    }
    if (options.eventDirectory.endsWith("/")) {
      throw new Error(
        '[YingYang] Please make sure your event directory doesnt end with a "/"! Example: `src/events`'
      );
    }
    if (options.mongoConnection) {
      connect(options.mongoConnection);
    }
    const CommandFiles: string[] = await globPromise(
      `${process.cwd()}/${options.commandDirectory}/**/*{.ts,.js}`
    );
    CommandFiles.forEach(async (filepath) => {
      const command: CommandInterface = await importFile(filepath);
      if (!command.name) return;
      this.commands.set(command.name.toLowerCase(), command);
    });
    const EventFiles: string[] = await globPromise(
      `${process.cwd()}/${options.eventDirectory}/**/*{.ts,.js}`
    );
    EventFiles.forEach(async (filepath) => {
      const event: Event<keyof ClientEvents> = await importFile(filepath);
      this.on(event.event, event.run);
    });

    // Personal Stuff
    const YingYangFiles: string[] = await globPromise(
      `${__dirname}/events/*{.ts,.js}`
    );
    YingYangFiles.forEach(async (filepath) => {
      const event: Event<keyof ClientEvents> = await importFile(filepath);
      this.on(event.event, event.run);
    });

    if (options.addDefaultCommands) {
      let cmds = options.addDefaultCommands as Array<string>;
      if (options.addDefaultCommands === true) {
        cmds = ["help", "ping", "prefix"];
      }
      const files: string[] = await globPromise(
        `${__dirname}/commands/*{.ts,.js}`
      );
      files.forEach(async (cmd) => {
        console.log(cmd);
        const file = await importFile(cmd);
        if (!file.name || !cmds.includes(file.name)) return;
        const previousCommand = this.commands.find(
          (f) => f.name.toLowerCase() === file.name.toLowerCase()
        );
        if (!previousCommand) {
          this.commands.set(file.name.toLowerCase(), file);
          Logger.info(
            `Loaded default command ${chalk.greenBright(file.name)}`,
            { label: "INFO" }
          );
        } else {
          Logger.warn(
            `Failed to load default Command, Command already exists! ${chalk.yellowBright(
              file.name
            )}`,
            { label: "WARN" }
          );
        }
      });
    }
  }
}

export { YingYang }