const path = require("path");
const scriptName = path.basename(__filename);

module.exports = () => {
  console.log("Loaded: " + scriptName);
};

module.exports.check = (message, roleName) => {
  try {
    let allowedRole = message.member.roles.find(r => r.name == roleName);
    if (allowedRole != null) {
      if (message.member.roles.has(allowedRole.id)) {
        return true;
      }
    } else {
      message.channel.send(
        `:warning: U dont have role: \`${roleName}\` to execute this command :warning:`
      );
      return false;
    }
  } catch (error) {
    console.error(`${error.message} in ${scriptName}`);
  }
};
