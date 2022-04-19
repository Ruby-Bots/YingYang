import { ICommand } from "yingyang";

export default new ICommand({
  name: `echo`,
  description: `Echo your message`,
  options: [
    { type: "STRING", name: "msg", description: "the message", required: true },
  ],
  category: "interaction",
  execute: async ({ ctx, args }) => {
    ctx.reply({ content: `${args.getString("msg")}` });
  },
});
