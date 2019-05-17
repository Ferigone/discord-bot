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
var playStatus = true;
var que = [{}];

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.play = async (message, client) => {
  if (hasRole.check(message, "@everyone") != true) return;

  let guildID = message.guild.id;
  if (eval(`que[0][${guildID}]`) === undefined) {
    eval(`que[0][${guildID}]=[]`);
  }

  // //Inside Varialbes
  let queryData = message.content
    .split(" ")
    .slice(1)
    .join(" ");
  if (queryData == "") {
    message.channel.send(":warning: Missing query! :warning:");
    return;
  }
  let vc = message.member.voiceChannelID;
  const channel = client.channels.get(vc);
  message.channel.send("Searching 🔎 `" + queryData + "`");
  request(
    {
      uri: query + queryData
    },
    function(error, response, body) {
      let $ = cheerio.load(body);

      $(".contains-addto > a").each(function(i, item) {
        if (i === 0) {
          let link = $(item);
          let href = link.attr("href");
          let ytLink = yt + href;
          // //If statements
          if (ytLink == undefined) {
            message.channel.send(":warning: Search Error :warning:");
            return;
          }
          if (!ytLink.includes("https://www.youtube.com/watch?v=")) {
            message.channel.send(":warning: Write Correct YT Link :warning:");
            return;
          }
          message.channel.send("Search result: " + ytLink);
          eval(`que[0][${guildID}].push('${ytLink}')`);
          if (eval(`que[0][${guildID}].length==1`)) {
            message.channel.fetchMessages({ limit: 1 }).then(messages => {
              let lastMessage = messages.first();
              lastMessage.delete();
            });
            playMusic(message, channel, eval(`que[0][${guildID}]`), guildID);
          } else {
            message.channel.send(
              ":musical_note: Added To Que: " +
                eval(`que[0][${guildID}].length`)
            );
            return;
          }
        }
      });
    }
  );
};

const playMusic = (m, h, y, g) => {
  let message = m;
  let channel = h;
  let link = y;
  let guildID = g;
  message.channel.send(`:musical_note: Actually playing:`);
  message.channel.send(`:arrow_forward:  ${link}`);
  channel
    .join()
    .then(connection => {
      global.stream = ytdl(`${link}`, {
        filter: "audioonly"
      });
      global.dispatcher = connection.playStream(stream, streamOptions);
      dispatcher.on("end", () => {
        message.channel.send(
          ":musical_note: Que: " + eval(`que[0][${guildID}].length`)
        );
        if (playStatus == false) {
          eval(`que[0][${guildID}]=[]`);
          playStatus = true;
          return;
        }
        if (eval(`que[0][${guildID}].length`) != 1) {
          playMusic(
            message,
            channel,
            eval(`que[0][${guildID}].shift(1)`),
            guildID
          );
        }
      });
    })
    .catch(e => {
      message.channel.send(`:exclamation: ${link} :exclamation:`);
      message.channel.send(":musical_note: Enter valid query!");
    });
};

module.exports.leave = (message, client) => {
  let vc = message.member.voiceChannelID;
  const channel = client.channels.get(vc);
  playStatus = false;
  channel.leave();
};

module.exports.skip = async message => {
  let guildID = message.guild.id;
  message.channel.send("▶▶ Skipped!");
  dispatcher.end();
};
