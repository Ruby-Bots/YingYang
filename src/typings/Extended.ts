import { Client, Collection } from "discord.js";
import { ClientOptions } from ".";
import { CommandInterface } from "./Commands";

export type ExtendedClient = {
  commands: Collection<string, CommandInterface>;
  Options: ClientOptions;
} & Client;