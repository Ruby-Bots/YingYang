"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../structures/Command");
const structures_1 = require("../structures");
const Formatters_1 = require("../utils/Formatters");
const Pagination_1 = require("../utils/Pagination");
exports.default = new Command_1.Command({
    name: `help`,
    description: `YingYangs default help command!`,
    category: "default",
    execute: async ({ ctx, args, client }) => {
        const certainCommand = args[0];
        if (!certainCommand) {
            const categories = [];
            const pages = [];
            client.commands.forEach((cmd) => {
                if (categories.includes(cmd.category.toLowerCase()))
                    return;
                categories.push(cmd.category.toLowerCase());
            });
            const dropDownCategories = [];
            categories.forEach((cata) => {
                dropDownCategories.push({
                    label: `${(0, Formatters_1.PermissionResolveableFormat)(cata)}`,
                    value: `${cata.toLowerCase()}`,
                });
                const commands = client.commands.filter((f) => f.category.toLowerCase() === cata.toLowerCase());
                const cmdArray = [];
                commands.forEach((c) => cmdArray.push(c));
                const CommandPages = [];
                const pageNums = 10;
                for (let i = 0; i < cmdArray.length; i++) {
                    CommandPages.push(new structures_1.YingYangEmbed({
                        title: `Category - ${(0, Formatters_1.PermissionResolveableFormat)(cata)}`,
                        description: `${cmdArray
                            .splice(0, pageNums)
                            .map((cmd) => `**${client.Options.defaultPrefix}${cmd.name}** - *${cmd.description}*`).join("\n")}`,
                    }));
                }
                pages.push({ id: cata.toLowerCase(), embed: CommandPages });
            });
            (0, Pagination_1.Pagination)(pages, ctx, client, dropDownCategories, "👀 | Choose a category!");
        }
    },
});
//# sourceMappingURL=help.js.map