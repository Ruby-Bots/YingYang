const { MessageEmbed } = require("discord.js");
const db = require("../../Structures/Schemas/antinukeSchema");
const database = require("quick.db");
const {
  Check,
  Cross,
  Right,
  Enabled,
  Disabled,
} = require("../../Structures/emojis.json");

module.exports = {
  name: "antinuke",
  userPermissions: ["ADMINISTRATOR"],
  run: async (client, message, args) => {
    let option = args[0];
    switch (option) {
      case "settings":
        {
          let toggle = {
            ChannelCreations: undefined,
            ChannelDeletions: undefined,
            RoleCreations: undefined,
            RoleDeletions: undefined,
            KicksBans: undefined,
            PermissionAdd: undefined,
            BotAdd: undefined,
          };
          let data = await db.findOne({ GuildID: message.guild.id });
          if (!data) await db.create({ GuildID: message.guild.id });
          data = await db.findOne({ GuildID: message.guild.id });
          if (data.ChannelCreations) {
            toggle["ChannelCreations"] = `${Enabled}`;
          }
          if (data.ChannelDeletions) {
            toggle["ChannelDeletions"] = `${Enabled}`;
          }
          if (data.RoleCreations) {
            toggle["RoleCreations"] = `${Enabled}`;
          }
          if (data.RoleDeletions) {
            toggle["RoleDeletions"] = `${Enabled}`;
          }
          if (data.KicksBans) {
            toggle["KicksBans"] = `${Enabled}`;
          }
          if (data.PermissionAdd) {
            toggle["PermissionAdd"] = `${Enabled}`;
          }
          if (data.BotAdd) {
            toggle["BotAdd"] = `${Enabled}`;
          }
          message.reply({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: `Dial AntiNuke Configuration`,
                  iconURL: `${message.guild.iconURL()}`,
                })
                .setColor(`#2f3136`)
                .addFields(
                  {
                    name: "[A] Channel Creations",
                    value: `${Right} Status: ${
                      toggle.ChannelCreations || `${Disabled}`
                    }\n${Right} Punishment: \`${data.Punishments['ChannelCreations'] || "ban"}\``,
                    inline: true,
                  },
                  {
                    name: "[B] Channel Deletions",
                    value: `${Right} Status: ${
                      toggle.ChannelDeletions || `${Disabled}`
                    }\n${Right} Punishment: \`${data.Punishments['ChannelDeletions'] || "ban"}\``,
                    inline: true,
                  },
                  {
                    name: "[C] Role Creations",
                    value: `${Right} Status: ${
                      toggle.RoleCreations || `${Disabled}`
                    }\n${Right} Punishment: \`${data.Punishments['RoleCreations'] || "ban"}\``,
                    inline: true,
                  },
                  {
                    name: "[D] Role Deletions",
                    value: `${Right} Status: ${
                      toggle.RoleDeletions || `${Disabled}`
                    }\n${Right} Punishment: \`${data.Punishments['RoleDeletions'] || "ban"}\``,
                    inline: true,
                  },
                  {
                    name: "[E] Kicks & Bans",
                    value: `${Right} Status: ${
                      toggle.KicksBans || `${Disabled}`
                    }\n${Right} Punishment: \`${data.Punishments['KicksAndBans'] || "ban"}\``,
                    inline: true,
                  },
                  {
                    name: "[F] Permissions Add",
                    value: `${Right} Status: ${
                      toggle.PermissionAdd || `${Disabled}`
                    }\n${Right} Punishment: \`${data.Punishments['PermissionsAdd'] || "ban"}\``,
                    inline: true,
                  },
                  {
                    name: "[G] Bot Add",
                    value: `${Right} Status: ${
                      toggle.BotAdd || `${Disabled}`
                    }\n${Right} Punishment: \`${data.Punishments['BotAdd'] || "ban"}\``,
                    inline: true,
                  }
                ),
            ],
          });
        }
        break;

      case "toggle":
        {
          let filter = args[1];
          if (!filter) {
            message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setDescription(
                    `${Cross} You must include a valid filter to toggle\n> \`channelcreations\` | \`channeldeletions\` | \`rolecreations\` | \`roledeletions\` | \`kicksbans\` | \`permissionsadd\` | \`botsadd\``
                  ),
              ],
            });
          }
          switch (filter) {
            case "A":
              {
                let data = await db.findOne({ GuildID: message.guild.id });
                if (!data) await db.create({ GuildID: message.guild.id });
                data = await db.findOne({ GuildID: message.guild.id });
                try {
                  if (data.ChannelCreations) {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        ChannelCreations: false,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`channelCreations\` module has been toggled to \`off\``
                          ),
                      ],
                    });
                  } else {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        ChannelCreations: true,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`channelCreations\` module has been toggled to \`on\``
                          ),
                      ],
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }
              break;

            case "B":
              {
                let data = await db.findOne({ GuildID: message.guild.id });
                if (!data) await db.create({ GuildID: message.guild.id });
                data = await db.findOne({ GuildID: message.guild.id });
                try {
                  if (data.ChannelDeletions) {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        ChannelDeletions: false,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`channelDeletions\` module has been toggled to \`off\``
                          ),
                      ],
                    });
                  } else {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        ChannelDeletions: true,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`channelDeletions\` module has been toggled to \`on\``
                          ),
                      ],
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }
              break;

            case "C":
              {
                let data = await db.findOne({ GuildID: message.guild.id });
                if (!data) await db.create({ GuildID: message.guild.id });
                data = await db.findOne({ GuildID: message.guild.id });
                try {
                  if (data.RoleCreations) {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        RoleCreations: false,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`roleCreations\` module has been toggled to \`off\``
                          ),
                      ],
                    });
                  } else {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        RoleCreations: true,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`roleCreations\` module has been toggled to \`on\``
                          ),
                      ],
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }
              break;

            case "D":
              {
                let data = await db.findOne({ GuildID: message.guild.id });
                if (!data) await db.create({ GuildID: message.guild.id });
                data = await db.findOne({ GuildID: message.guild.id });
                try {
                  if (data.RoleDeletions) {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        RoleDeletions: false,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`roleDeletions\` module has been toggled to \`off\``
                          ),
                      ],
                    });
                  } else {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        RoleDeletions: true,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`roleDeletions\` module has been toggled to \`on\``
                          ),
                      ],
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }
              break;

            case "E":
              {
                let data = await db.findOne({ GuildID: message.guild.id });
                if (!data) await db.create({ GuildID: message.guild.id });
                data = await db.findOne({ GuildID: message.guild.id });
                try {
                  if (data.KicksBans) {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        KicksBans: false,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`Kicks&Bans\` module has been toggled to \`off\``
                          ),
                      ],
                    });
                  } else {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        KicksBans: true,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`Kicks&Bans\` module has been toggled to \`on\``
                          ),
                      ],
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }
              break;

            case "F":
              {
                let data = await db.findOne({ GuildID: message.guild.id });
                if (!data) await db.create({ GuildID: message.guild.id });
                data = await db.findOne({ GuildID: message.guild.id });
                try {
                  if (data.PermissionAdd) {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        PermissionAdd: false,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`permissionsAdd\` module has been toggled to \`off\``
                          ),
                      ],
                    });
                  } else {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        PermissionAdd: true,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`permissionsAdd\` module has been toggled to \`on\``
                          ),
                      ],
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }
              break;

            case "G":
              {
                let data = await db.findOne({ GuildID: message.guild.id });
                if (!data) await db.create({ GuildID: message.guild.id });
                data = await db.findOne({ GuildID: message.guild.id });
                try {
                  if (data.BotAdd) {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        BotAdd: false,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`botsAdd\` module has been toggled to \`off\``
                          ),
                      ],
                    });
                  } else {
                    await db.findOneAndUpdate(
                      { GuildID: message.guild.id },
                      {
                        BotAdd: true,
                      }
                    );
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor(`GREEN`)
                          .setDescription(
                            `${Check} The \`botsAdd\` module has been toggled to \`on\``
                          ),
                      ],
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }
              break;
          }
        }
        break;

      case "punishment":
        {
          let filter = args[1];
          switch (filter) {
            case "A":
              {
                let punishment = args[2];
                switch (punishment) {
                  case "ban":
                    {
                      let data = await db.findOne({
                        GuildID: message.guild.id,
                      });
                      if (!data) await db.create({ GuildID: message.guild.id });
                      data = await db.findOne({ GuildID: message.guild.id });
                      if (!data.Punishments) {
                        await db.findOneAndUpdate(
                          { GuildID: message.guild.id },
                          { Punishments: { ChannelCreations: "ban" } }
                        );
                      } else {
                        delete data.Punishments["ChannelCreations"];
                        const obj = {
                          ChannelCreations: "ban",
                          ...data.Punishments,
                        };
                        await db.findOneAndUpdate(
                          { GuildID: message.guild.id },
                          { Punishments: obj }
                        );
                      }
                      message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(
                              `${Check} The punishment for \`channelCreations\` was set to **ban**`
                            ),
                        ],
                      });
                    }
                    break;

                  case "kick":
                    {
                      let data = await db.findOne({
                        GuildID: message.guild.id,
                      });
                      if (!data) await db.create({ GuildID: message.guild.id });
                      data = await db.findOne({ GuildID: message.guild.id });
                      if (!data.Punishments) {
                        await db.findOneAndUpdate(
                          { GuildID: message.guild.id },
                          { Punishments: { ChannelCreations: "kick" } }
                        );
                      } else {
                        delete data.Punishments["ChannelCreations"];
                        const obj = {
                          ChannelCreations: "kick",
                          ...data.Punishments,
                        };
                        await db.findOneAndUpdate(
                          { GuildID: message.guild.id },
                          { Punishments: obj }
                        );
                      }
                      message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(
                              `${Check} The punishment for \`channelCreations\` was set to **kick**`
                            ),
                        ],
                      });
                    }
                    break;

                  case "mute": {
                    let data = await db.findOne({ GuildID: message.guild.id });
                    if (!data) await db.create({ GuildID: message.guild.id });
                    data = await db.findOne({ GuildID: message.guild.id });
                    if (!data.Punishments) {
                      await db.findOneAndUpdate(
                        { GuildID: message.guild.id },
                        { Punishments: { ChannelCreations: "mute" } }
                      );
                    } else {
                      delete data.Punishments["ChannelCreations"];
                      const obj = {
                        ChannelCreations: "mute",
                        ...data.Punishments,
                      };
                      await db.findOneAndUpdate(
                        { GuildID: message.guild.id },
                        { Punishments: obj }
                      );
                    }
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("GREEN")
                          .setDescription(
                            `${Check} The punishment for \`channelCreations\` was set to **mute**`
                          ),
                      ],
                    });
                  }
                }
              }
              break;
          }
        }
        break;
    }
  },
};
