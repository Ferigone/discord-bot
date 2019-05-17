const config = require("../modules/config.js");
const hasRole = require("../modules/hasRole.js");
const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.user = async (message, client) => {
  if (
    hasRole.check(message, "Admin") == true ||
    hasRole.check(message, "Mod") == true
  ) {
    let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
    let split = withoutPrefix.split(/ +/);
    let userName = split[1];
    let mess = message.content.split('"')[1];
    let user = client.users.find(user => user.username == userName);

    message.channel
      .send({
        embed: {
          color: 0xf44336,
          author: {
            name: "Ban Confirm",
            icon_url: client.user.avatarURL
          },
          fields: [
            {
              name: "Username",
              value: user.username
            },
            {
              name: "Reason",
              value: mess
            }
          ],
          timestamp: new Date(),
          footer: {
            text: "© Fuckers Community"
          }
        }
      })
      .then(function(message) {
        message.react("✔");
        message.react("✖");
      })
      .catch(function() {
        //Something
      });
  } else {
    return;
  }
};
