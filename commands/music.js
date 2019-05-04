const config = require("./../config.js");
const ytdl = require("ytdl-core");
const path = require("path");
const scriptName = path.basename(__filename);
const streamOptions = { seek: 0, volume: 1 };
var que = [{}];

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.play = async (message, client) => {
  let guildID = message.guild.id;
  if (eval(`que[0][${guildID}]`) === undefined) {
    eval(`que[0][${guildID}]=[]`);
  }

  // //Inside Varialbes
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let ytLink = split[1];
  let vc = message.member.voiceChannelID;
  const channel = client.channels.get(vc);

  // //If statements
  if (ytLink == undefined) {
    message.channel.send(":warning: Write YT Link :warning:");
    return;
  }
  if (!ytLink.includes("https://www.youtube.com/watch?v=")) {
    message.channel.send(":warning: Write Correct YT Link :warning:");
    return;
  }
  if (eval(`que[0][${guildID}].length`) == 0) {
    message.channel.fetchMessages({ limit: 1 }).then(messages => {
      let lastMessage = messages.first();
      lastMessage.delete();
    });
    eval(`que[0][${guildID}].push('${ytLink}')`);
    playMusic(message, channel, eval(`que[0][${guildID}][0]`), guildID);
  } else if (eval(`que[0][${guildID}].length`) > 0) {
    eval(`que[0][${guildID}].push('${ytLink}')`);
    message.channel.send(
      ":musical_note: Added To Que: " + eval(`que[0][${guildID}].length`)
    );
  }
};

const playMusic = (m, h, y, g) => {
  let message = m;
  let channel = h;
  let link = y;
  let guildID = g;
  message.channel.send(`:musical_note: Actually playing:`);
  message.channel.send(`:arrow_forward:  ${eval(`que[0][${guildID}][0]`)}`);
  channel
    .join()
    .then(connection => {
      const stream = ytdl(`${link}`, {
        filter: "audioonly"
      });
      const dispatcher = connection.playStream(stream, streamOptions);
      dispatcher.on("end", () => {
        remove(eval(`que[0][${guildID}]`), link);
        if (eval(`que[0][${guildID}][0]`) != undefined) {
          playMusic(message, channel, eval(`que[0][${guildID}][0]`));
        } else {
          if (que.length == 0) {
            setTimeout(() => {
              channel.leave();
            }, 5000);
          }
        }
      });
    })
    .catch(e => {
      message.channel.send(`:exclamation: ${link} :exclamation:`);
      message.channel.send(":musical_note: Enter valid link!");
    });
};

const remove = (array, element) => {
  const index = array.indexOf(element);
  array.splice(index, 1);
};

module.exports.leave = (message, client) => {
  let vc = message.member.voiceChannelID;
  const channel = client.channels.get(vc);
  channel.leave();
};
