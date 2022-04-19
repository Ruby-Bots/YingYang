"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const discord_js_1 = require("discord.js");
const Logger_1 = require("./Logger");
const Pagination = async (pages, message, client, categorys, dropdownPlaceholder) => {
    try {
        let dropdown;
        if (categorys) {
            dropdown = new discord_js_1.MessageActionRow().addComponents([
                new discord_js_1.MessageSelectMenu()
                    .addOptions(categorys)
                    .setCustomId("command_dropdown")
                    .setPlaceholder(dropdownPlaceholder || "Choose a category"),
            ]);
        }
        const buttons = new discord_js_1.MessageActionRow().addComponents([
            new discord_js_1.MessageButton()
                .setEmoji(`⏮️`)
                .setStyle("PRIMARY")
                .setDisabled(true)
                .setCustomId("first_page"),
            new discord_js_1.MessageButton()
                .setEmoji(`⬅️`)
                .setStyle("PRIMARY")
                .setDisabled(true)
                .setCustomId("back_page"),
            new discord_js_1.MessageButton()
                .setEmoji(`➡️`)
                .setStyle("PRIMARY")
                .setCustomId("forward_page"),
            new discord_js_1.MessageButton()
                .setEmoji(`⏭️`)
                .setStyle("PRIMARY")
                .setCustomId("last_page"),
        ]);
        const firstPage = pages[0].embed[0];
        let currentCategory = pages[0].id;
        let currentpages;
        pages.map((p) => {
            if (p.id === currentCategory) {
                currentpages = p.embed;
            }
        });
        if (currentpages.length === 1) {
            buttons.components[0].setDisabled(true);
            buttons.components[1].setDisabled(true);
            buttons.components[2].setDisabled(true);
            buttons.components[3].setDisabled(true);
        }
        const components = [];
        if (dropdown) {
            components.push(dropdown);
        }
        components.push(buttons);
        const interaction = await message
            .reply({
            components: components,
            embeds: [firstPage],
        });
        let pageOnEnd;
        const collector = message.channel.createMessageComponentCollector({
            time: 35000,
        });
        let page = 0;
        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id || i.user.bot)
                return;
            await i.deferUpdate();
            if (i.isButton()) {
                switch (i.customId) {
                    case "first_page":
                        page = 0;
                        break;
                    case "last_page":
                        page = currentpages.length - 1;
                        break;
                    case "back_page":
                        page = page > 0 ? --page : 0;
                        break;
                    case "forward_page":
                        page =
                            page < currentpages.length - 1 ? ++page : currentpages.length - 1;
                        break;
                }
                if (page === currentpages.length - 1) {
                    buttons.components[0].setDisabled(false);
                    buttons.components[1].setDisabled(false);
                    buttons.components[2].setDisabled(true);
                    buttons.components[3].setDisabled(true);
                }
                if (page === 0) {
                    buttons.components[0].setDisabled(true);
                    buttons.components[1].setDisabled(true);
                    buttons.components[2].setDisabled(false);
                    buttons.components[3].setDisabled(false);
                }
                if (page !== 0 && page !== currentpages.length - 1) {
                    buttons.components[0].setDisabled(false);
                    buttons.components[1].setDisabled(false);
                    buttons.components[2].setDisabled(false);
                    buttons.components[3].setDisabled(false);
                }
                interaction
                    .edit({
                    components: components,
                    embeds: [currentpages[page]],
                })
                    .catch(() => {
                    collector.stop("error");
                });
            }
            if (i.isSelectMenu()) {
                const value = i.values[0];
                pages.forEach((p) => {
                    if (p.id === value) {
                        currentCategory = value;
                    }
                });
                pages.map((p) => {
                    if (p.id === currentCategory) {
                        currentpages = p.embed;
                    }
                });
                page = 0;
                if (currentpages.length > 1) {
                    buttons.components[0].setDisabled(true);
                    buttons.components[1].setDisabled(true);
                    buttons.components[2].setDisabled(false);
                    buttons.components[3].setDisabled(false);
                }
                if (currentpages.length === 1) {
                    buttons.components[0].setDisabled(true);
                    buttons.components[1].setDisabled(true);
                    buttons.components[2].setDisabled(true);
                    buttons.components[3].setDisabled(true);
                }
                interaction
                    .edit({
                    components: components,
                    embeds: [currentpages[page]],
                })
                    .catch(() => {
                    collector.stop("error");
                });
                pageOnEnd = page;
            }
        });
        collector.on("end", (c, r) => {
            buttons.components[0].setDisabled(true);
            buttons.components[1].setDisabled(true);
            buttons.components[2].setDisabled(true);
            buttons.components[3].setDisabled(true);
            dropdown.components[0].setDisabled(true);
            interaction
                .edit({
                components: components,
                embeds: [currentpages[pageOnEnd]],
            })
                .catch(() => { });
        });
    }
    catch (err) {
        Logger_1.Logger.error("Default error, pagination please report it at the support server (https://discord.gg/n5ctDKvrM5)!", { label: "ERROR" });
    }
};
exports.Pagination = Pagination;
//# sourceMappingURL=Pagination.js.map