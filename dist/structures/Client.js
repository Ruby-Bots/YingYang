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
exports.YingYang = void 0;
const discord_js_1 = require("discord.js");
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
const Logger_1 = require("../utils/Logger");
const chalk_1 = __importDefault(require("chalk"));
const connect_1 = __importDefault(require("../schemas/connect"));
const globPromise = (0, util_1.promisify)(glob_1.default);
const importFile = async (filePath) => {
    return (await Promise.resolve().then(() => __importStar(require(filePath))))?.default;
};
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
        this["Options"] = Config;
        this["Client"] = this;
    }
    start(options) {
        if (!options.token) {
            throw new Error(`[YingYang] Please supply a discord bot token!`);
        }
        this.login(options.token);
        this.ClientSetup();
    }
    async ClientSetup() {
        const options = this.Options;
        if (options.defaultPrefix === "") {
            throw new Error("[YingYang] Please make sure to supply a valid prefix!");
        }
        if (!options.commandDirectory) {
            throw new Error(`[YingYang] Please supply a valid commands directory!`);
        }
        if (!options.eventDirectory) {
            throw new Error(`[YingYang] Please supply a valid events directory!`);
        }
        if (options.commandDirectory.endsWith("/")) {
            throw new Error('[YingYang] Please make sure your command directory doesnt end with a "/"! Example: `src/commands`');
        }
        if (options.eventDirectory.endsWith("/")) {
            throw new Error('[YingYang] Please make sure your event directory doesnt end with a "/"! Example: `src/events`');
        }
        if (options.mongoConnection) {
            (0, connect_1.default)(options.mongoConnection);
        }
        const CommandFiles = await globPromise(`${process.cwd()}/${options.commandDirectory}/**/*{.ts,.js}`);
        CommandFiles.forEach(async (filepath) => {
            const command = await importFile(filepath);
            if (!command.name)
                return;
            this.commands.set(command.name.toLowerCase(), command);
        });
        const EventFiles = await globPromise(`${process.cwd()}/${options.eventDirectory}/**/*{.ts,.js}`);
        EventFiles.forEach(async (filepath) => {
            const event = await importFile(filepath);
            this.on(event.event, event.run);
        });
        // Personal Stuff
        const YingYangFiles = await globPromise(`${__dirname}/events/*{.ts,.js}`);
        YingYangFiles.forEach(async (filepath) => {
            const event = await importFile(filepath);
            this.on(event.event, event.run);
        });
        if (options.addDefaultCommands) {
            let cmds = options.addDefaultCommands;
            if (options.addDefaultCommands === true) {
                cmds = ["help", "ping", "prefix"];
            }
            const files = await globPromise(`${__dirname}/commands/*{.ts,.js}`);
            files.forEach(async (cmd) => {
                console.log(cmd);
                const file = await importFile(cmd);
                if (!file.name || !cmds.includes(file.name))
                    return;
                const previousCommand = this.commands.find((f) => f.name.toLowerCase() === file.name.toLowerCase());
                if (!previousCommand) {
                    this.commands.set(file.name.toLowerCase(), file);
                    Logger_1.Logger.info(`Loaded default command ${chalk_1.default.greenBright(file.name)}`, { label: "INFO" });
                }
                else {
                    Logger_1.Logger.warn(`Failed to load default Command, Command already exists! ${chalk_1.default.yellowBright(file.name)}`, { label: "WARN" });
                }
            });
        }
    }
}
exports.YingYang = YingYang;
//# sourceMappingURL=Client.js.map