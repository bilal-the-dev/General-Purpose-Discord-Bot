const { PermissionFlagsBits } = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");

const config = require("../../ticket.json");

const createTicketChannel = async (guild, parent, user) =>
	await guild.channels.create({
		name: user.username,
		parent,
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
};
