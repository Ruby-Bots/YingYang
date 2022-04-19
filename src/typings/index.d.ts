import {
  ChatInputApplicationCommandData,
  Client,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  Message,
  PermissionResolvable,
} from "discord.js";


export {
  Command,
  Event,
  ICommand,
  YingYangEmbed,
} from "../structures";


// Client
export interface defaultCommands {
  help: string;
  ping: string;
  prefix: string;
}

export interface ClientOptions {
  defaultPrefix?: string | "?";
  commandDirectory?: string | `src/commands`;
  mongoConnection?: string;
  eventDirectory?: string | `src/events`;
  sandBoxServers?: Array<string> | null;
  addDefaultCommands?: boolean | Array<keyof defaultCommands>;
  botOwners?: Array<string>;
  slashCommands?: boolean;
  plugins?: any[];
}

export type ExtendedClient = {
  commands: Collection<string, CommandInterface>;
  slashCommands: Collection<string, ICommandTypes>;
  Options: ClientOptions;
} & Client;

// Commands

export interface CommandOptions {
  client: ExtendedClient;
  ctx: Message;
  args: string[];
  prefix: string;
  formattedArgs: object;
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
  cooldown?: number;
  execute: CommandType;
}

// Slash Commands;
export interface Extendedinteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  ctx: Extendedinteraction;
  args: CommandInteractionOptionResolver;
}

type RunFun = (options: RunOptions) => any;

export type ICommandTypes = {
  category: string;
  testOnly?: boolean;
  ownerOnly?: boolean;
  expectedArgs?: string[];
  cooldown?: number;
  execute: RunFun;
} & ChatInputApplicationCommandData;

// Base Export

export class YingYang extends Client {
  public Client: Client;
  public Options: ClientOptions;
  public commands: Collection<string, CommandInterface>;
  constructor(Config: ClientOptions);
  start(options: { token: string });
  getConfig(config?: keyof ClientOptions);
  setDefaultPrefix(prefix: string);
}