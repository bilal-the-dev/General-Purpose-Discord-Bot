const config = require("./../../../welcome_leave.json");

const { GUILD_ID, WELCOME_LEAVE_CHANNEL_ID } = process.env;

const sendMesage = async (client, member, data) => {
	if (member.guild.id !== GUILD_ID) return;

	onsole.log(data);

	if (!data) return;

	const ch = client.channels.cache.get(WELCOME_LEAVE_CHANNEL_ID);

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
