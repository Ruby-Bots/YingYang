export const StringFormat = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
export const PermissionResolveableFormat = (perm: string) => {
    const ws = [];
    perm.split("_").forEach((w) => { ws.push(StringFormat(w)); })
    return ws.join(" ")
}