"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
exports.default = new structures_1.Event(`interactionCreate`, (i) => {
    const client = i.client;
    if (i.isCommand()) {
        const command = client.slashCommands.find(f => f.name.toLowerCase() === i.commandName.toLowerCase());
        if (!command)
            return;
    }
});
//# sourceMappingURL=interactionCreate.js.map