"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = __importDefault(require("mongoose"));
const configableClientSettings_1 = __importDefault(require("../schemas/Collections/configableClientSettings"));
const Command_1 = require("../structures/Command");
const utils_1 = require("../utils");
exports.default = new Command_1.Command({
    name: `prefix`,
    description: `Change the default prefix.`,
    category: "default",
    execute: async ({ ctx, client, args, prefix }) => {
        if (mongoose_1.default.connection.readyState !== 1) {
            return utils_1.Logger.error(`Failed to use prefix command! ${chalk_1.default.redBright(`No mongoose connection found!`)}`, { label: `ERROR` });
        }
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