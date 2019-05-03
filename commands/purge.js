const config = require("./../config.js");
const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.run = async message => {
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let messAmount = split[1];
  let startValue = 0;
  let forInterval = setInterval(() => {
    message.channel
      .fetchMessages({ limit: 1 })
      .then(messages => {
        let lastMessage = messages.first();
        if (lastMessage == undefined) {
          clearInterval(forInterval);
        } else {
          try {
            lastMessage.delete();
          } catch (e) {
            console.log("");
          }
        }
      })
      .catch(e => {
        console.error("");
      });
    if (startValue == messAmount + 1) {
      clearInterval(forInterval);
    }
    startValue += 1;
  }, 500);
};
