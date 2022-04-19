import { YingYang } from "yingyang";
import "dotenv/config";
const client = new YingYang({
  slashCommands: true,
  addDefaultCommands: true,
  sandBoxServers: [`961705808679272448`],
  mongoConnection: process.env.MONGO_DB
  // plugins: [Starboard],
});
client.start({ token: process.env.TOKEN });
export default client;