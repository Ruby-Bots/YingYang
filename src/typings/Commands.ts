import { Client, Message } from "discord.js";
import { YingYang } from "../structures/";
import { ExtendedClient } from "./Extended";

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
  execute: CommandType;
}
