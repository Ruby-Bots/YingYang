"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configableClientSettings_1 = __importDefault(require("../schemas/Collections/configableClientSettings"));
const Event_1 = require("../structures/Event");
const flags_1 = require("../modules/flags");
const mongoose_1 = __importDefault(require("mongoose"));
const cooldowns_1 = __importDefault(require("../modules/cooldowns"));
const utils_1 = require("../utils");
exports.default = new Event_1.Event(`messageCreate`, async (msg) => {
    const client = msg.client;
    let guildData;
    if (mongoose_1.default.connection.readyState === 1) {
        guildData = await configableClientSettings_1.default.findOne({ guildId: msg.guild.id });
    }
    const prefix = guildData ? guildData.prefix : null || client.Options.defaultPrefix;
    if (msg.author.bot || !msg.guild || !prefix || !msg.content.startsWith(prefix))
        return;
    const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = client.commands.find((f) => f.name.toLowerCase() === cmd.toLowerCase() ||
        f.aliases?.includes(cmd.toLowerCase()));
    if (!command)
        return;
    if (command.cooldown) {
        console.log(mongoose_1.default.connection.readyState);
        if (mongoose_1.default.connection.readyState === 1) {
            (0, cooldowns_1.default)(command, msg.author.id, msg, {
                args: args,
                client: client,
                formattedArgs: (0, flags_1.flags)(args.join(" ")),
                ctx: msg,
                prefix: prefix,
            }, false);
        }
        else {
            utils_1.Logger.error(`Cooldowns only work if you have a mongodb database connected to your bot! Please either connect one via the \`mongoConnection\` in your YingYang client, or connect one manually`, { label: "ERROR" });
            command.execute({
                args: args,
                client: client,
                formattedArgs: (0, flags_1.flags)(args.join(" ")),
                ctx: msg,
                prefix: prefix,
            });
        }
    }
    else {
        command.execute({
            args: args,
            client: client,
            formattedArgs: (0, flags_1.flags)(args.join(" ")),
            ctx: msg,
            prefix: prefix,
        });
    }
});
//# sourceMappingURL=messageCreate.js.map