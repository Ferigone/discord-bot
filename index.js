const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.js");

//Commands
const help = require("./commands/help.js");
help();
const role = require("./commands/role.js");
role();
const purge = require("./commands/purge.js");
purge();
const say = require("./commands/say.js");
say();
const music = require("./commands/music.js");
music();

//Variables
const prefix = config.arr[0].prefix;
const authKey = config.arr[0].authToken;
let start = 0;

//Code
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("ready", () => {
  setInterval(() => {
    if (start == 0) {
      client.user.setPresence({
        game: {
          name: `${client.guilds.size} Servers`,
          type: "LISTENING"
        },
        status: "online"
      });
      start = 1;
    } else if (start == 1) {
      client.user.setPresence({
        game: {
          name: "Prefix -> " + prefix,
          type: "LISTENING"
        },
        status: "online"
      });
      start = 2;
    } else if (start == 2) {
      client.user.setPresence({
        game: {
          name: "Anime",
          type: "WATCHING"
        },
        status: "online"
      });
      start = 0;
    }
  }, 10000);
});

client.on("guildCreate", guild => {
  console.log(
    `Added to server: ${guild.name} (id: ${guild.id}). Server has ${
      guild.memberCount
    } members`
  );
  client.user.setActivity(`Working for ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Working for ${client.guilds.size} servers`);
});

client.on("message", async (message, guild) => {
  if (message.content.startsWith(prefix)) {
    const input = message.content.slice(prefix.length).split(" ");
    const command = input.shift();

    if (message.author.bot) return;

    if (command === "help") {
      help.run(client, message);
    } else if (command === "say") {
      say.run(message);
    } else if (command === "purge") {
      purge.run(message);
    } else if (command === "addRole") {
      role.add(message, guild);
    } else if (command === "rmRole") {
      role.rm(message);
    } else if (command === "createRole") {
      role.create(message);
    } else if (command === "play") {
      music.play(message, client);
    } else if (command === "leave") {
      music.leave(message, client);
    }
  }
});

client.login(authKey);
