import { Client, Collection, ColorResolvable } from "discord.js";

export interface defaultCommands {
  help: string;
  ping: string;
  prefix: string;
}

export interface ClientOptions {
  defaultPrefix: string = "?";
  commandDirectory: string = `${process.cwd}/src/commands`;
  mongoConnection: Connection | null;
  eventDirectory: string = `${process.cwd}/src/events`;
  sandBoxServers?: Array<string> | null;
  addDefaultCommands?: boolean | Array<keyof defaultCommands>;
}


export type ExtendedClient = {
  commands: Collection<string, CommandInterface>;
  Options: ClientOptions;
} & Client;

export interface CommandOptions {
  client: ExtendedClient;
  ctx: Message;
  args: string[];
  prefix: string;
}

export type CommandType = (options: CommandOptions) => any;

export interface CommandInterface {
  name: string;
  description: string;
  category: string;
  testOnly?: boolean;
  ownerOnly?: boolean;
  minArgs?: number;
  expectedArgs?: string[];
  aliases?: string[];
  execute: CommandType;
}

import { YingYang } from "../structures";


export default class YingYang extends Client {
  public Client: Client;
  public Options: ClientOptions;
  public commands: Collection<string, CommandInterface>;
  constructor(Config: clientOptions);
}