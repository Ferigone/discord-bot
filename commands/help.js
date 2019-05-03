const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.run = async (client, message) => {
  message.channel
    .send({
      embed: {
        color: 3447003,
        author: {
          name: "Commands List",
          icon_url: client.user.avatarURL
        },
        fields: [
          {
            name: "Basic Commands",
            value: "`help`  `say`  `purge`"
          },
          {
            name: "Music",
            value: "`play`  `leave`"
          },
          {
            name: "Role Mangement",
            value: "`addRole`  `rmRole`  `createRole`"
          }
        ],
        timestamp: new Date(),
        footer: {
          text: "© Fuckers Community"
        }
      }
    })
    .catch(e => {
      console.log(e);
    });
};
