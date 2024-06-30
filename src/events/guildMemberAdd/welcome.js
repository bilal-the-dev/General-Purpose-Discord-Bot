const {
	sendWelcomeMessage,
} = require("../../utils/welcomeLeave.js/sendMessage");

module.exports = async (client, member) =>
	sendWelcomeMessage(client, member).catch((e) => console.log(e));
