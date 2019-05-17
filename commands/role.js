const config = require("../modules/config.js");
const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.add = async message => {
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let roleName = split[1];

  let memberRole = message.guild.roles.find(
    role => role.name === `${roleName}`
  );
  try {
    message.member.addRole(memberRole);
  } catch (e) {
    console.log(e);
  }
};

module.exports.rm = async message => {
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let roleName = split[1];
  let memberRole = message.guild.roles.find(
    role => role.name === `${roleName}`
  );
  try {
    message.member.removeRole(memberRole);
  } catch (e) {
    console.log(e);
  }
};

module.exports.create = async (message, guild) => {
  let withoutPrefix = message.content.slice(config.arr[0].prefix.length);
  let split = withoutPrefix.split(/ +/);
  let roleName = split[1];
  let color = message.content.split("#")[1];
  message.guild
    .createRole({
      name: `${roleName}`,
      color: `#${color}`
    })
    .then(role =>
      console.log(
        `Created new role with name ${role.name} and color ${role.color}`
      )
    )
    .catch(console.error);
};
