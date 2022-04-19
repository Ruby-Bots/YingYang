"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("YingYang/Cooldowns", new mongoose_1.Schema({
    userId: { type: String },
    command: { type: String },
    length: { type: Number },
    now: { type: Number },
}));
//# sourceMappingURL=cooldowns.js.map