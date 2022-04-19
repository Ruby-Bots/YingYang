"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Logger_1 = require("../utils/Logger");
exports.default = (db) => {
    (0, mongoose_1.connect)(db)
        .then(() => {
        Logger_1.Logger.info(`Connected to database`, { label: "INFO" });
    })
        .catch(() => Logger_1.Logger.error(`Failed to connect to database`, { label: "ERROR" }));
};
//# sourceMappingURL=connect.js.map