import { CommandInterface } from "../typings";

export class Command {
  constructor(options: CommandInterface) {
    Object.assign(this, { type: "msg", options: options });
  }
}
