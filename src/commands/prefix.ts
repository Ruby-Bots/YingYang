import chalk from "chalk";
import mongoose from "mongoose";
import configableClientSettings from "../schemas/Collections/configableClientSettings";
import { Command } from "../structures/Command";
import { Logger } from "../utils";

export default new Command({
  name: `prefix`,
  description: `Change the default prefix.`,
  category: "default",
  execute: async ({ ctx, client, args, prefix }) => {
    if (mongoose.connection.readyState !== 1) {
      return Logger.error(`Failed to use prefix command! ${chalk.redBright(`No mongoose connection found!`)}`, { label: `ERROR` })
    }
    const newPrefix = args[0]
    if (!newPrefix) {
      ctx.reply({ content: `The current prefix is \`${prefix}\``})
    } else {
      const data = await configableClientSettings.findOne({ guildId: ctx.guild.id })
      if(!data) await configableClientSettings.create({ guildId: ctx.guild.id, prefix });
      await configableClientSettings.findOneAndUpdate({ guildId: ctx.guild.id }, {
        prefix: newPrefix.slice(0, 5)
      })

      ctx.reply({ content: `Prefix has been updated to \`${newPrefix.slice(0,5)}\``})
    }
  },
});
