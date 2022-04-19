import { ICommandTypes } from "../typings";

export class ICommand {
  constructor(commandOptions: ICommandTypes) {
    Object.assign(this, { type: "slash", options: commandOptions });
  }
}