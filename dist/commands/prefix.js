"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configableClientSettings_1 = __importDefault(require("../schemas/Collections/configableClientSettings"));
const Command_1 = require("../structures/Command");
exports.default = new Command_1.Command({
    name: `prefix`,
    description: `Change the default prefix.`,
    category: "default",
    execute: async ({ ctx, client, args, prefix }) => {
        const newPrefix = args[0];
        if (!newPrefix) {
            ctx.reply({ content: `The current prefix is \`${prefix}\`` });
        }
        else {
            const data = await configableClientSettings_1.default.findOne({ guildId: ctx.guild.id });
            if (!data)
                await configableClientSettings_1.default.create({ guildId: ctx.guild.id, prefix });
            await configableClientSettings_1.default.findOneAndUpdate({ guildId: ctx.guild.id }, {
                prefix: newPrefix.slice(0, 5)
            });
            ctx.reply({ content: `Prefix has been updated to \`${newPrefix.slice(0, 5)}\`` });
        }
    },
});
//# sourceMappingURL=prefix.js.map