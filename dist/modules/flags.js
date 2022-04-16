"use strict";
/*
    Example return;
    args: --embed --reason=spamming emojis
    returns
    {
        embed: true,
        reason: "spamming emojis",
    }
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.flags = void 0;
const flags = (str) => {
    let obj = {};
    str.split("-").forEach((value) => {
        let values = value.split("=");
        if (values.length < 2) {
            const key = value.trim().replace(" ", "");
            if (key === " " || key === "")
                return;
            obj[key] = true;
            return;
        }
        obj[values[0].replace(" ", "")] = values[1].trim();
    });
    return obj;
};
exports.flags = flags;
//# sourceMappingURL=flags.js.map