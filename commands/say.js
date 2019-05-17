const config = require("../modules/config.js");
const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.run = async message => {
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let chID = split[1];
  let mess = message.content.split('"')[1];
  let channel = client.channels.find("name", chID);
  channel.send(mess);
};
