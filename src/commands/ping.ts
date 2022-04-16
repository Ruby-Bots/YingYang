import { Command } from "../structures/Command";

export default new Command({
    name: `ping`,
    description: `Find the bots current websocket ping.`,
    category: "default",
    execute: async ({ ctx, client }) => {
        ctx.channel.send({ content: `${client.ws.ping}ms!`})
    }
})