"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cooldowns_1 = __importDefault(require("../schemas/Collections/cooldowns"));
const structures_1 = require("../structures");
const cooldowns = async (command, userId, message, commandParmas, embed) => {
    let cooldown = await cooldowns_1.default.findOne({ userId, command: command.name });
    if (cooldown) {
        const now = Date.now();
        const expiratioDate = command.cooldown + cooldown.now;
        if (now < expiratioDate) {
            const timeLeftWhole = (expiratioDate - now) / 1000;
            let timeLeft;
            if (timeLeftWhole > 2629800) {
                timeLeft = { type: "month(s)", time: timeLeftWhole / 2629800 };
            }
            if (timeLeftWhole > 604800) {
                timeLeft = { type: "week(s)", time: timeLeftWhole / 604800 };
            }
            if (timeLeftWhole > 86400) {
                timeLeft = { type: "day(s)", time: timeLeftWhole / 86400 };
            }
            if (timeLeftWhole > 3600) {
                timeLeft = { type: "hour(s)", time: timeLeftWhole / 3600 };
            }
            if (timeLeftWhole > 60) {
                timeLeft = { type: "minute(s)", time: timeLeftWhole / 60 };
            }
            if (timeLeftWhole < 60) {
                timeLeft = { type: "second(s)", time: timeLeftWhole };
            }
            if (embed) {
                return message.reply({
                    embeds: [
                        new structures_1.YingYangEmbed({
                            description: `**Slow down there,** Please wait another \`${Math.round(timeLeft.time)}\` ${timeLeft.type}.`,
                        }),
                    ],
                });
            }
            else {
                message.reply({
                    content: `**Slow down there,** Please wait another \`${Math.round(timeLeft.time)}\` ${timeLeft.type}.`,
                });
            }
        }
        else {
            await cooldowns_1.default.findOneAndRemove({ userId, command: command.name });
            cooldowns(command, userId, message, commandParmas);
        }
    }
    else {
        await cooldowns_1.default.create({
            userId,
            command: command.name,
            length: command.cooldown,
            now: Date.now(),
        });
        command.execute(commandParmas);
    }
};
exports.default = cooldowns;
//# sourceMappingURL=cooldowns.js.map