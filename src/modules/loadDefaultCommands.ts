import { CommandInterface, ExtendedClient } from "../typings";
import { promisify } from "util";
import glob from "glob"
import { Logger } from "../utils";
import chalk from "chalk";
import { importFile } from "../structures/Client";
const globPromise = promisify(glob);

const LoadDefaultCommands = async (client: ExtendedClient) => {
    const files: string[] = await globPromise(
        `${__dirname}/../commands/*{.ts,.js}`
    );

    files.forEach(async (cmd) => {
        const file: { type: "msg"; options: CommandInterface } = await importFile(cmd);
        if (!file.options.name) return;
        const previousCommand = client.commands.find(
            (f) => f.name.toLowerCase() === file.options.name.toLowerCase()
        );
        if (!previousCommand) {
            client.commands.set(file.options.name.toLowerCase(), file.options);
            Logger.info(
                `Loaded default command ${chalk.greenBright(file.options.name)}`,
                { label: "INFO" }
            );
        } else {
            Logger.warn(
                `Failed to load default Command, Command already exists! ${chalk.yellowBright(
                    file.options.name
                )}`,
                { label: "WARN" }
            );
        }
    })
}
export default LoadDefaultCommands;