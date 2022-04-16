import { Client, Collection } from "discord.js";
import { YingYang } from "../structures/Client";
import configableClientSettings from "../schemas/Collections/configableClientSettings";
import { Event } from "../structures/Event";
import { ExtendedClient } from "../typings/Extended";
import { flags } from "../modules/flags";

export default new Event(`messageCreate`, async (msg) => {
    const client = msg.client as ExtendedClient;
    const guildData = await configableClientSettings.findOne({ guildId: msg.guild.id })
    const prefix = guildData ? guildData.prefix : null || client.Options.defaultPrefix;
    if (msg.author.bot || !msg.guild || !prefix || !msg.content.startsWith(prefix)) return;
    const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g)
    const command = client.commands.find(
      (f) =>
        f.name.toLowerCase() === cmd.toLowerCase() ||
        f.aliases?.includes(cmd.toLowerCase())
    );
    if (!command) return;
    command.execute({
        args: args,
        client: client,
        formattedArgs: flags(args.join(" ")),
        ctx: msg,
        prefix: prefix
    })
})