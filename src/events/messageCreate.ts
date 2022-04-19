import configableClientSettings from "../schemas/Collections/configableClientSettings";
import { Event } from "../structures/Event";
import { ExtendedClient } from "../typings/";
import { flags } from "../modules/flags";
import mongoose from "mongoose";
import cooldowns from "../modules/cooldowns";
import { Logger } from "../utils";

export default new Event(`messageCreate`, async (msg) => {
    const client = msg.client as ExtendedClient;
    let guildData;
    if (mongoose.connection.readyState === 1) { 
       guildData = await configableClientSettings.findOne({ guildId: msg.guild.id })
    }
    const prefix = guildData ? guildData.prefix : null || client.Options.defaultPrefix;
    if (msg.author.bot || !msg.guild || !prefix || !msg.content.startsWith(prefix)) return;
    const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g)
    const command = client.commands.find(
      (f) =>
        f.name.toLowerCase() === cmd.toLowerCase() ||
        f.aliases?.includes(cmd.toLowerCase())
    );
    if (!command) return;
  if (command.cooldown) {
      console.log(mongoose.connection.readyState);
      if (mongoose.connection.readyState === 1) {
          cooldowns(
            command,
            msg.author.id,
            msg,
            {
              args: args,
              client: client,
              formattedArgs: flags(args.join(" ")),
              ctx: msg,
              prefix: prefix,
            },
            false
          );
      } else {
        Logger.error(
          `Cooldowns only work if you have a mongodb database connected to your bot! Please either connect one via the \`mongoConnection\` in your YingYang client, or connect one manually`, { label: "ERROR"}
        );
        command.execute({
          args: args,
          client: client,
          formattedArgs: flags(args.join(" ")),
          ctx: msg,
          prefix: prefix,
        });
       }
    } else {
        command.execute({
          args: args,
          client: client,
          formattedArgs: flags(args.join(" ")),
          ctx: msg,
          prefix: prefix,
        });
    }
})