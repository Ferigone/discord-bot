const config = require("./../config.js");
const ytdl = require("ytdl-core");
const path = require("path");
const scriptName = path.basename(__filename);
var que = [];
const streamOptions = { seek: 0, volume: 1 };

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.play = async (message, client) => {
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let ytLink = split[1];
  let vc = message.member.voiceChannelID;
  const channel = client.channels.get(vc);
  if (que.length == 0) {
    message.channel.fetchMessages({ limit: 1 }).then(messages => {
      let lastMessage = messages.first();
      lastMessage.delete();
    });
    que.push(ytLink);
    playMusic(message, channel, que[0]);
  } else if (que.length > 0) {
    que.push(ytLink);
    message.channel.send(":musical_note: Added To Que: " + que.length);
  }
};

const playMusic = (m, h, y) => {
  let message = m;
  let channel = h;
  let link = y;
  message.channel.send(`:musical_note: Actually playing:`);
  message.channel.send(`:arrow_forward:  ${que[0]}`);
  channel
    .join()
    .then(connection => {
      const stream = ytdl(`${link}`, {
        filter: "audioonly"
      });
      const dispatcher = connection.playStream(stream, streamOptions);
      dispatcher.on("end", () => {
        remove(que, link);
        if (que[0] != undefined) {
          playMusic(message, channel, que[0]);
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
