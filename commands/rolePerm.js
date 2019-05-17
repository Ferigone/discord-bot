const fs = require("fs");
const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.set = async message => {};

module.exports.createCustom = async message => {
  const perms = fs.readFileAsync("./roleCommandPerm.json");
  let guildID = message.guild.id;
  var permsContent = JSON.parse(perms);
  if (eval(`permsContent[0][${guildID}]`) === undefined) {
    eval(`permsContent[0][${guildID}]=[{}]`);
  }
  console.log(permsContent);
};
