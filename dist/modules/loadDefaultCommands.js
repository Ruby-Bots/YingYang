"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
const utils_1 = require("../utils");
const chalk_1 = __importDefault(require("chalk"));
const Client_1 = require("../structures/Client");
const globPromise = (0, util_1.promisify)(glob_1.default);
const LoadDefaultCommands = async (client) => {
    const files = await globPromise(`${__dirname}/../commands/*{.ts,.js}`);
    files.forEach(async (cmd) => {
        const file = await (0, Client_1.importFile)(cmd);
        if (!file.options.name)
            return;
        const previousCommand = client.commands.find((f) => f.name.toLowerCase() === file.options.name.toLowerCase());
        if (!previousCommand) {
            client.commands.set(file.options.name.toLowerCase(), file.options);
            utils_1.Logger.info(`Loaded default command ${chalk_1.default.greenBright(file.options.name)}`, { label: "INFO" });
        }
        else {
            utils_1.Logger.warn(`Failed to load default Command, Command already exists! ${chalk_1.default.yellowBright(file.options.name)}`, { label: "WARN" });
        }
    });
};
exports.default = LoadDefaultCommands;
//# sourceMappingURL=loadDefaultCommands.js.map