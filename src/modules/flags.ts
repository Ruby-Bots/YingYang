
/*
    Example return;
    args: --embed --reason=spamming emojis
    returns 
    {
        embed: true,
        reason: "spamming emojis",
    }
*/

export const flags = (str: string) => {
    let obj: Object = {};
    str.split("-").forEach((value) => {
      let values = value.split("=");
      if (values.length < 2) {
        const key = value.trim().replace(" ", "");
        if (key === " " || key === "") return;
        obj[key] = true;
        return;
      }
      obj[values[0].replace(" ", "")] = values[1].trim();
    });
    return obj;
}