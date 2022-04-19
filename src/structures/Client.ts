import { ApplicationCommandDataResolvable, Client, ClientEvents, ClientOptions, Collection } from "discord.js";
import {
  ClientOptions as clientOptions,
  CommandInterface,
  ICommandTypes,
} from "../typings/";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Event";
import { Logger } from "../utils/Logger";
import chalk from "chalk";
import connect from "../schemas/connect";
import mongoose from "mongoose";
import configableClientSettings from "../schemas/Collections/configableClientSettings";
import { fileURLToPath } from "url";

const globPromise = promisify(glob);

export const importFile = async (filePath: string) => {
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
  public slashCommands: Collection<string, ICommandTypes> = new Collection();
  constructor(Config?: clientOptions) {
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
    this["Options"] = Config || {
      addDefaultCommands: true,
      commandDirectory: `commands`,
      defaultPrefix: "y!",
      eventDirectory: `events`,
      slashCommands: false,
    };
    this["Client"] = this;
  }

  start(options: { token: string }) {
    if (!options.token) {
      throw new Error(`[YingYang] Please supply a discord bot token!`);
    }
    this.login(options.token);
    this.ClientSetup();
  }
  public getOptions(option: keyof ClientEvents) {
    if (!option) {
      return this.Options;
    } else {
      const opti = this.Options[option];
      if (!opti) {
        throw new Error(`[YINGYANG] "${option}" is not a valid client option!`);
      }
      return opti;
    }
  }
  public async setDefaultPreifx(str: string) {
    if (mongoose.connection.readyState !== 1) {
      return Logger.error(
        `Failed to set prefix. | ${chalk.redBright(
          `No mongoose connection found!`
        )}`,
        { label: `ERROR` }
      );
    }
    const data = await configableClientSettings.findOne({
      clientId: this.user.id,
    });
    if (!data)
      await configableClientSettings.create({ clientId: this.user.id });
    await configableClientSettings.findOneAndUpdate(
      { clientId: this.user.id },
      {
        prefix: str.slice(0, 5),
      }
    );
    return Logger.info(`Prefix has been updated "${str.slice(0, 5)}"`, {
      label: "INFO",
    });
  }
  private async ClientSetup() {
    const options = this.Options;

    // Setting Options incase they dont exist;
    if (!options || !options.defaultPrefix) {
      this.Options["defaultPrefix"] = "y!";
    }
    if (!options || !options.commandDirectory) {
      this.Options["commandDirectory"] = "commands";
    }
    if (!options || !options.eventDirectory) {
      this.Options["eventDirectory"] = "events";
    }

    // Testing supplied options;
    if (options.defaultPrefix === "") {
      throw new Error("[YingYang] Please make sure to supply a valid prefix!");
    }
    if (!options.commandDirectory) {
      throw new Error("[YingYang] Please supply a valid commands directory!");
    }
    if (options.commandDirectory.endsWith("/")) {
      throw new Error(
        '[YingYang] Please make sure your command directory doesnt end with a "/"! Example: `src/commands`'
      );
    }
    if (!options.eventDirectory) {
      throw new Error(`[YingYang] Please supply a valid events directory!`);
    }
    if (options.eventDirectory.endsWith("/")) {
      throw new Error(
        '[YingYang] Please make sure your event directory doesnt end with a "/"! Example: `src/events`'
      );
    }
    if (options.mongoConnection) {
      connect(options.mongoConnection);
    }

    // Handlers;
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const CommandFiles: string[] = await globPromise(
      `${process.cwd()}/${options.commandDirectory}/**/*{.ts,.js}`
    );
    CommandFiles.forEach(async (filepath) => {
      const command:
        | { type: "msg"; options: CommandInterface }
        | { type: "slash"; options: ICommandTypes } = await importFile(
        filepath
        );
      if (!command.options || !command.options.name) return;
      if (command.type === "msg") {
        this.commands.set(command.options.name.toLowerCase(), command.options as CommandInterface);
      } else if (command.type === "slash") {
        this.slashCommands.set(
          command.options.name.toLowerCase(),
          command.options as ICommandTypes
        );
        slashCommands.push(command.options as ICommandTypes);
      }
    });
    if (options.slashCommands) {
      this.on("ready", () => {
        const testServers = options.sandBoxServers.slice(0, 10);
        if (testServers || testServers.length > 1 && slashCommands.length > 1) {
          testServers.forEach((serverId) => {
            const server = this.guilds.cache.find(f => f.id === serverId);
            if (!server) { return Logger.error(`Failed to find a sandbox server under the id of "${serverId}"`, { label: "ERROR" }) }
            server.commands?.set(slashCommands).then(() => {
              Logger.info(`Slash commands have been loaded to server ${chalk.greenBright(`${server.name} (${server.id})`)}`, {label: "INFO"})
            }).catch((err) => {
              return Logger.error(`Failed to set slash commands in server ${chalk.redBright(server.name)}`, { label: "ERROR" })
            })
          })
        } else if (
          !testServers ||
          (testServers.length < 1 && slashCommands.length > 1)
        ) {
          this.application?.commands
            .set(slashCommands)
            .then(() => {
              Logger.info(
                `Slash commands have been loaded ${chalk.greenBright(
                  "globally"
                )}`,
                { label: "INFO" }
              );
            })
            .catch((err) => {
              Logger.error(`Failed to load slash commands globally!`, {
                label: "ERROR",
              });
            });
        }
      })
    }
    const EventFiles: string[] = await globPromise(
      `${process.cwd()}/${options.eventDirectory}/**/*{.ts,.js}`
    );
    EventFiles.forEach(async (filepath) => {
      const event: Event<keyof ClientEvents> = await importFile(filepath);
      this.on(event.event, event.run);
    });

    // Personal Handlers;
    const YingYangFiles: string[] = await globPromise(
      `${__dirname}/../events/*{.ts,.js}`
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
        `${__dirname}/../commands/*{.ts,.js}`
      );
      files.forEach(async (cmd) => {
        const file: { type: "msg"; options: CommandInterface } =
          await importFile(cmd);
        if (!file.options.name || !cmds.includes(file.options.name)) return;
        const previousCommand = this.commands.find(
          (f) => f.name.toLowerCase() === file.options.name.toLowerCase()
        );
        if (!previousCommand) {
          this.commands.set(file.options.name.toLowerCase(), file.options);
          Logger.info(
            `Loaded default command ${chalk.greenBright(file.options.name)}`,
            { label: "INFO" }
          );
        } else {
          Logger.warn(
            `Failed to load default Command, Command already exists! ${chalk.yellowBright(
              file.options.name
            )}`,
            { label: "WARN" }
          );
        }
      });
    }
    if (options.plugins && options.plugins.length > 0) {
      options.plugins.forEach(async (plugin) => {
        await plugin();
      })
    }
  }
}

export { YingYang };
