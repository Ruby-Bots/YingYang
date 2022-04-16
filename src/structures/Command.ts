import { CommandInterface } from "../typings/Commands";

export class Command {
    constructor(options: CommandInterface) {
        Object.assign(this, options)
    }
}
