"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configableClientSettings_1 = __importDefault(require("../schemas/Collections/configableClientSettings"));
const Event_1 = require("../structures/Event");
const flags_1 = require("../modules/flags");
exports.default = new Event_1.Event(`messageCreate`, async (msg) => {
    const client = msg.client;
    const guildData = await configableClientSettings_1.default.findOne({ guildId: msg.guild.id });
    const prefix = guildData ? guildData.prefix : null || client.Options.defaultPrefix;
    if (msg.author.bot || !msg.guild || !prefix || !msg.content.startsWith(prefix))
        return;
    const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = client.commands.find((f) => f.name.toLowerCase() === cmd.toLowerCase() ||
        f.aliases?.includes(cmd.toLowerCase()));
    if (!command)
        return;
    command.execute({
        args: args,
        client: client,
        formattedArgs: (0, flags_1.flags)(args.join(" ")),
        ctx: msg,
        prefix: prefix
    });
});
//# sourceMappingURL=messageCreate.js.map