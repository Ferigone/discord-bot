const config = require("../modules/config.js");
const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.run = async message => {
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let calcRequest = split[1];
  if (calcRequest == undefined)
    return message.channel.send(":warning: Enter Numbers");
  try {
    let answer = eval(calcRequest);
    message.channel.send("🔢 Result: " + answer);
  } catch (err) {
    message.channel.send(":warning: Math Error");
  }
};
