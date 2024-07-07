const { PermissionFlagsBits } = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");

const config = require("../../ticket.json");

const createTicketChannel = async (guild, user) =>
	await guild.channels.create({
		name: `${user.username}_${user.id}`,
		parent: config.CATEGORY_ID,
		permissionOverwrites: [
			{
				id: guild.roles.everyone,
				deny: PermissionFlagsBits.ViewChannel,
			},
			{
				id: user.id,
				allow: PermissionFlagsBits.ViewChannel,
			},
			{
				id: config.STAFF_ROLE_ID,
				allow: PermissionFlagsBits.ViewChannel,
			},
		],
	});

const deletePreviousTickets = async (client, id) => {
	const tickets = client.channels.cache.filter((c) => {
		// console.log(c.parentId === config.CATEGORY_ID);
		// console.log(c.name === username);
		// console.log(c.parentId === config.CATEGORY_ID && c.name === username);
		// console.log(c.parentId);
		// console.log(c.name);

		return c.parentId === config.CATEGORY_ID && c.name.split("_")[1] === id;
	});

	console.log(tickets.size);

	if (tickets.size === 0) return;
	const deletions = tickets.map((t) => t.delete());

	console.log(deletions);
	await Promise.all(deletions);
};
const generateTranscript = async (channel) =>
	await discordTranscripts.createTranscript(channel, {
		poweredBy: false,
		filename: `logs.html`,
	});

const sendTranscriptInLogs = async (guild, attachment) => {
	const transcriptChannel = await guild.channels.fetch(
		config.TRANSCRIPT_CHANNEL_ID
	);

	await transcriptChannel.send({ files: [attachment] });
};
module.exports = {
	createTicketChannel,
	sendTranscriptInLogs,
	generateTranscript,
	deletePreviousTickets,
};
