"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionResolveableFormat = exports.StringFormat = void 0;
const StringFormat = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
exports.StringFormat = StringFormat;
const PermissionResolveableFormat = (perm) => {
    const ws = [];
    perm.split("_").forEach((w) => { ws.push((0, exports.StringFormat)(w)); });
    return ws.join(" ");
};
exports.PermissionResolveableFormat = PermissionResolveableFormat;
//# sourceMappingURL=Formatters.js.map