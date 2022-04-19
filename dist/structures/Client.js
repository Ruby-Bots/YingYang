"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingYang = exports.importFile = void 0;
const discord_js_1 = require("discord.js");
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
const Logger_1 = require("../utils/Logger");
const chalk_1 = __importDefault(require("chalk"));
const connect_1 = __importDefault(require("../schemas/connect"));
const mongoose_1 = __importDefault(require("mongoose"));
const configableClientSettings_1 = __importDefault(require("../schemas/Collections/configableClientSettings"));
const globPromise = (0, util_1.promisify)(glob_1.default);
const importFile = async (filePath) => {
    return (await Promise.resolve().then(() => __importStar(require(filePath))))?.default;
};
exports.importFile = importFile;
class YingYang extends discord_js_1.Client {
    Client;
    Options;
    clientOptions = {
        intents: 32767,
        allowedMentions: { repliedUser: false },
        partials: [
            "REACTION",
            "CHANNEL",
            "GUILD_MEMBER",
            "GUILD_SCHEDULED_EVENT",
            "USER",
            "MESSAGE",
        ],
    };
    commands = new discord_js_1.Collection();
    slashCommands = new discord_js_1.Collection();
    constructor(Config) {
        super({
            intents: 32767,
            allowedMentions: { repliedUser: false },
            partials: [
                "REACTION",
                "CHANNEL",
                "GUILD_MEMBER",
                "GUILD_SCHEDULED_EVENT",
                "USER",
                "MESSAGE",
            ],
        });
        this["Options"] = Config || {
            addDefaultCommands: true,
            commandDirectory: `commands`,
            defaultPrefix: "y!",
            eventDirectory: `events`,
            slashCommands: false,
        };
        this["Client"] = this;
    }
    start(options) {
        if (!options.token) {
            throw new Error(`[YingYang] Please supply a discord bot token!`);
        }
        this.login(options.token);
        this.ClientSetup();
    }
    getOptions(option) {
        if (!option) {
            return this.Options;
        }
        else {
            const opti = this.Options[option];
            if (!opti) {
                throw new Error(`[YINGYANG] "${option}" is not a valid client option!`);
            }
            return opti;
        }
    }
    async setDefaultPreifx(str) {
        if (mongoose_1.default.connection.readyState !== 1) {
            return Logger_1.Logger.error(`Failed to set prefix. | ${chalk_1.default.redBright(`No mongoose connection found!`)}`, { label: `ERROR` });
        }
        const data = await configableClientSettings_1.default.findOne({
            clientId: this.user.id,
        });
        if (!data)
            await configableClientSettings_1.default.create({ clientId: this.user.id });
        await configableClientSettings_1.default.findOneAndUpdate({ clientId: this.user.id }, {
            prefix: str.slice(0, 5),
        });
        return Logger_1.Logger.info(`Prefix has been updated "${str.slice(0, 5)}"`, {
            label: "INFO",
        });
    }
    async ClientSetup() {
        const options = this.Options;
        // Setting Options incase they dont exist;
        if (!options || !options.defaultPrefix) {
            this.Options["defaultPrefix"] = "y!";
        }
        if (!options || !options.commandDirectory) {
            this.Options["commandDirectory"] = "commands";
        }
        if (!options || !options.eventDirectory) {
            this.Options["eventDirectory"] = "events";
        }
        // Testing supplied options;
        if (options.defaultPrefix === "") {
            throw new Error("[YingYang] Please make sure to supply a valid prefix!");
        }
        if (!options.commandDirectory) {
            throw new Error("[YingYang] Please supply a valid commands directory!");
        }
        if (options.commandDirectory.endsWith("/")) {
            throw new Error('[YingYang] Please make sure your command directory doesnt end with a "/"! Example: `src/commands`');
        }
        if (!options.eventDirectory) {
            throw new Error(`[YingYang] Please supply a valid events directory!`);
        }
        if (options.eventDirectory.endsWith("/")) {
            throw new Error('[YingYang] Please make sure your event directory doesnt end with a "/"! Example: `src/events`');
        }
        if (options.mongoConnection) {
            (0, connect_1.default)(options.mongoConnection);
        }
        // Handlers;
        const slashCommands = [];
        const CommandFiles = await globPromise(`${process.cwd()}/${options.commandDirectory}/**/*{.ts,.js}`);
        CommandFiles.forEach(async (filepath) => {
            const command = await (0, exports.importFile)(filepath);
            if (!command.options || !command.options.name)
                return;
            if (command.type === "msg") {
                this.commands.set(command.options.name.toLowerCase(), command.options);
            }
            else if (command.type === "slash") {
                this.slashCommands.set(command.options.name.toLowerCase(), command.options);
                slashCommands.push(command.options);
            }
        });
        if (options.slashCommands) {
            this.on("ready", () => {
                const testServers = options.sandBoxServers.slice(0, 10);
                if (testServers || testServers.length > 1 && slashCommands.length > 1) {
                    testServers.forEach((serverId) => {
                        const server = this.guilds.cache.find(f => f.id === serverId);
                        if (!server) {
                            return Logger_1.Logger.error(`Failed to find a sandbox server under the id of "${serverId}"`, { label: "ERROR" });
                        }
                        server.commands?.set(slashCommands).then(() => {
                            Logger_1.Logger.info(`Slash commands have been loaded to server ${chalk_1.default.greenBright(`${server.name} (${server.id})`)}`, { label: "INFO" });
                        }).catch((err) => {
                            return Logger_1.Logger.error(`Failed to set slash commands in server ${chalk_1.default.redBright(server.name)}`, { label: "ERROR" });
                        });
                    });
                }
                else if (!testServers ||
                    (testServers.length < 1 && slashCommands.length > 1)) {
                    this.application?.commands
                        .set(slashCommands)
                        .then(() => {
                        Logger_1.Logger.info(`Slash commands have been loaded ${chalk_1.default.greenBright("globally")}`, { label: "INFO" });
                    })
                        .catch((err) => {
                        Logger_1.Logger.error(`Failed to load slash commands globally!`, {
                            label: "ERROR",
                        });
                    });
                }
            });
        }
        const EventFiles = await globPromise(`${process.cwd()}/${options.eventDirectory}/**/*{.ts,.js}`);
        EventFiles.forEach(async (filepath) => {
            const event = await (0, exports.importFile)(filepath);
            this.on(event.event, event.run);
        });
        // Personal Handlers;
        const YingYangFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        YingYangFiles.forEach(async (filepath) => {
            const event = await (0, exports.importFile)(filepath);
            this.on(event.event, event.run);
        });
        if (options.addDefaultCommands) {
            let cmds = options.addDefaultCommands;
            if (options.addDefaultCommands === true) {
                cmds = ["help", "ping", "prefix"];
            }
            const files = await globPromise(`${__dirname}/../commands/*{.ts,.js}`);
            files.forEach(async (cmd) => {
                const file = await (0, exports.importFile)(cmd);
                if (!file.options.name || !cmds.includes(file.options.name))
                    return;
                const previousCommand = this.commands.find((f) => f.name.toLowerCase() === file.options.name.toLowerCase());
                if (!previousCommand) {
                    this.commands.set(file.options.name.toLowerCase(), file.options);
                    Logger_1.Logger.info(`Loaded default command ${chalk_1.default.greenBright(file.options.name)}`, { label: "INFO" });
                }
                else {
                    Logger_1.Logger.warn(`Failed to load default Command, Command already exists! ${chalk_1.default.yellowBright(file.options.name)}`, { label: "WARN" });
                }
            });
        }
        if (options.plugins && options.plugins.length > 0) {
            options.plugins.forEach(async (plugin) => {
                await plugin();
            });
        }
    }
}
exports.YingYang = YingYang;
//# sourceMappingURL=Client.js.map