const config = require("./../../../welcome_leave.json");

const sendMesage = async (client, member, data) => {
	console.log(data);
	if (!data) return;
	const ch = client.channels.cache.get(process.env.WELCOME_LEAVE_CHANNEL_ID);
	if (!ch) return;

	const content = data.text
		.replaceAll("${user}", member)
		.replaceAll("${server}", member.guild.name);

	await ch.send({ content, files: [data.attachment] });
};

const sendWelcomeMessage = async (client, member) =>
	await sendMesage(client, member, config.welcome_message);

const sendLeaveMessage = async (client, member) =>
	await sendMesage(client, member, config.leave_message);

module.exports = { sendLeaveMessage, sendWelcomeMessage };
