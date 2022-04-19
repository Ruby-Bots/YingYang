import { Command } from "../structures/Command";
import { YingYangEmbed } from "../structures";
import { CommandInterface } from "../typings";
import { PermissionResolveableFormat } from "../utils/Formatters";
import { Page, Pagination } from "../utils/Pagination";

export default new Command({
  name: `help`,
  description: `YingYangs default help command!`,
  category: "default",
  execute: async ({ ctx, args, client }) => {
    const certainCommand = args[0];
    if (!certainCommand) {
      const categories = [];
      const pages: Array<Page> = [];
      client.commands.forEach((cmd) => {
        if (categories.includes(cmd.category.toLowerCase())) return;
        categories.push(cmd.category.toLowerCase());
      });
      client.slashCommands.forEach((cmd) => {
        if (categories.includes(cmd.category.toLowerCase())) return;
        categories.push(cmd.category.toLowerCase());
      });
      const dropDownCategories = [];
      categories.forEach((cata: string) => {
        dropDownCategories.push({
          label: `${PermissionResolveableFormat(cata)}`,
          value: `${cata.toLowerCase()}`,
        });
        const commands = client.commands.filter(
          (f) => f.category.toLowerCase() === cata.toLowerCase()
        );
        const cmdArray = [];
        commands.forEach((c) => cmdArray.push(c));
        client.slashCommands.filter(f => f.category.toLowerCase() === cata.toLowerCase()).forEach((cm) => { cmdArray.push(cm) })
        const CommandPages = [];
        const pageNums = 10;
        for (let i = 0; i < cmdArray.length; i++) {
          CommandPages.push(
            new YingYangEmbed({
              title: `Category - ${PermissionResolveableFormat(cata)}`,
              description: `${cmdArray
                .splice(0, pageNums)
                .map(
                  (cmd: CommandInterface) =>
                    `**${client.Options.defaultPrefix}${cmd.name}** - *${cmd.description}*`
                ).join("\n")}`,
            })
          );
          }
          pages.push({id: cata.toLowerCase(), embed: CommandPages})
      });
        Pagination(pages, ctx, client, dropDownCategories, "👀 | Choose a category!")
    }
  },
});
