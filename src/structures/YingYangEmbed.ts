import { ColorResolvable, MessageEmbed, MessageEmbedOptions } from "discord.js";

let color: ColorResolvable;
const odds = Math.floor(Math.random() * 100);
if (odds > 50) { color = "#000000" } else { color = "#FFFFFF" }

export class YingYangEmbed {
    constructor(data: MessageEmbedOptions) {
        return new MessageEmbed({
            color: color,
            ...data
        })
    }
}

