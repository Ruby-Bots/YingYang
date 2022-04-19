import { model, Schema } from "mongoose"

export interface Options {
    guildId: string;
    clientId: string;
    prefix: string;
}
export default model(`YingYang/ClientConfigSettings`, new Schema<Options>({
    guildId: { type: String },
    clientId: { type: String },
    prefix: { type: String }
}))