import { STATUS_CODES } from "http";
import { model, Schema } from "mongoose"

export interface Options {
    guildId: string;
    prefix: string;
}
export default model(`YingYang/ClientConfigSettings`, new Schema<Options>({
    guildId: { type: String },
    prefix: { type: String }
}))