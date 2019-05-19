const config = require("../modules/config.js");
const hasRole = require("../modules/hasRole.js");
const ytdl = require("ytdl-core");
const path = require("path");
const scriptName = path.basename(__filename);
const streamOptions = { seek: 0, volume: 1 };
const request = require("request");
const cheerio = require("cheerio");
const query = "https://www.youtube.com/results?search_query=";
const yt = "https://www.youtube.com";
const queue = new Map();

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.play = async (message, client) => {
  if (hasRole.check(message, "DJ") != true) return;
  const channel = client.channels.get(message.member.voiceChannelID);
  const serverQueue = queue.get(message.guild.id);
  // //Inside Varialbes
  let queryData = message.content
    .split(" ")
    .slice(1)
    .join(" ");
  if (queryData == "") {
    message.channel.send(":warning: Missing query! :warning:");
    return;
  }
  message.channel.send("Searching 🔎 `" + queryData + "`");
  request(
    {
      uri: query + queryData
    },
    async (error, response, body) => {
      let $ = cheerio.load(body);
      $(".yt-uix-tile-link").each(function(i, item) {
        if (i === 0) {
          let title = $(item).attr("title");
          let link = yt + $(item).attr("href");
          // //If statements
          if (link == undefined) {
            message.channel.send(":warning: Search Error :warning:");
            return;
          }
          if (!link.includes("https://www.youtube.com/watch?v=")) {
            message.channel.send(":warning: Search Error :warning:");
            return;
          }
          const song = {
            title: title,
            url: link
          };
          message.channel.send("Search result: " + link);
          if (!serverQueue) {
            const queueContruct = {
              textChannel: message.channel,
              voiceChannel: channel,
              connection: null,
              songs: [],
              volume: 0.5,
              playing: true
            };

            queue.set(message.guild.id, queueContruct);

            queueContruct.songs.push(song);

            try {
              channel.join().then(connection => {
                queueContruct.connection = connection;
                message.channel.fetchMessages({ limit: 1 }).then(messages => {
                  let lastMessage = messages.first();
                  lastMessage.delete();
                });
                playMusic(message.guild, message);
              });
            } catch (err) {
              //console.log(err);
              queue.delete(message.guild.id);
              message.channel.send(err);
              return;
            }
          } else {
            serverQueue.songs.push(song);
            message.channel.send(
              `:musical_note: Added to queue: ${serverQueue.songs.length}`
            );
            return;
          }
        }
      });
    }
  );
};

const playMusic = (guild, message) => {
  const serverQueue = queue.get(guild.id);
  if (serverQueue.songs.length < 1) {
    queue.delete(guild.id);
    return;
  }
  message.channel.send(`:musical_note: Actually playing:`);
  message.channel.send(`:arrow_forward:  ${serverQueue.songs[0].url}`);
  const dispatcher = serverQueue.connection
    .playStream(ytdl(serverQueue.songs[0].url), streamOptions)
    .on("end", () => {
      serverQueue.songs.shift();
      playMusic(guild, message);
    })
    .on("error", error => {
      console.error(error);
    });
  dispatcher.setVolume(serverQueue.volume);
};

module.exports.leave = async (message, client) => {
  const channel = client.channels.get(message.member.voiceChannelID);
  channel.leave();
  queue.delete(message.guild.id);
  return;
};

module.exports.skip = async message => {
  const serverQueue = queue.get(message.guild.id);
  try {
    message.channel.send("▶▶ Skipped!");
    serverQueue.connection.dispatcher.end();
  } catch (err) {}
};

module.exports.volume = async message => {
  const serverQueue = queue.get(message.guild.id);
  let volume = message.content.split(" ")[1];
  serverQueue.connection.dispatcher.setVolume(volume);
};

module.exports.clearq = async message => {
  const serverQueue = queue.get(message.guild.id);
  serverQueue.songs = [];
};

module.exports.showq = async (message, client) => {
  const serverQueue = queue.get(message.guild.id);
  const arr = [];
  for (let i = 0; i < serverQueue.songs.length; i++) {
    if (i == 0) {
      let tmp = {
        name: "Current: `" + serverQueue.songs[i].title + "`",
        value: "--------------------------------------"
      };
      arr.push(tmp);
    } else {
      let tmp = {
        name: i + ": `" + serverQueue.songs[i].title + "`",
        value: "--------------------------------------"
      };
      arr.push(tmp);
    }
  }
  message.channel
    .send({
      embed: {
        color: 3447003,
        author: {
          name: "Actual Queue",
          icon_url: client.user.avatarURL
        },
        fields: arr,
        timestamp: new Date(),
        footer: {
          text: "© Mariusz Bot"
        }
      }
    })
    .catch(e => {
      console.log(e);
    });
};
