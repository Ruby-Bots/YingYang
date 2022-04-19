"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingYangEmbed = void 0;
const discord_js_1 = require("discord.js");
let color;
const odds = Math.floor(Math.random() * 100);
if (odds > 50) {
    color = "#000000";
}
else {
    color = "#FFFFFF";
}
class YingYangEmbed {
    constructor(data) {
        return new discord_js_1.MessageEmbed({
            color: color,
            ...data
        });
    }
}
exports.YingYangEmbed = YingYangEmbed;
//# sourceMappingURL=YingYangEmbed.js.map