const { sendLeaveMessage } = require("../../utils/welcomeLeave.js/sendMessage");

module.exports = async (client, member) =>
	sendLeaveMessage(client, member).catch((e) => console.log(e));
