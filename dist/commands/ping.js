"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../structures/Command");
exports.default = new Command_1.Command({
    name: `ping`,
    description: `Find the bots current websocket ping.`,
    category: "default",
    execute: async ({ ctx, client }) => {
        ctx.channel.send({ content: `${client.ws.ping}ms!` });
    }
});
//# sourceMappingURL=ping.js.map