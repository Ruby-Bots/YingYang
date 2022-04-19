import { Event } from "../structures";
import { ExtendedClient } from "../typings";

export default new Event(`interactionCreate`, (i) => {
    const client = i.client as ExtendedClient;
    if (i.isCommand()) {
        const command = client.slashCommands.find(f => f.name.toLowerCase() === i.commandName.toLowerCase());
        if (!command) return;
        
    }
})