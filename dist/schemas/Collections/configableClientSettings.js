"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)(`YingYang/ClientConfigSettings`, new mongoose_1.Schema({
    guildId: { type: String },
    prefix: { type: String }
}));
//# sourceMappingURL=configableClientSettings.js.map