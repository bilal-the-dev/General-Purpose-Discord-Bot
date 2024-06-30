const {
	replyOrEditInteraction,
	handleInteractionError,
} = require("../../utils/interaction");
const {
	generateTranscript,
	sendTranscriptInLogs,
} = require("../../utils/misc");

module.exports = async (client, interaction) => {
	try {
		if (!interaction.isButton()) return;

		const { customId, channel, guild } = interaction;

		if (customId !== "cancelClose" && customId !== "confirmClose") return;

		await interaction.deferUpdate({ ephemeral: true });

		if (customId === "cancelClose") {
			return await replyOrEditInteraction(interaction, {
				content: `canceló la operación.`,
				ephemeral: true,
				components: [],
				embeds: [],
			});
		}

		await replyOrEditInteraction(interaction, {
			content: "Eliminando el ticket en 5 segundos.",
			components: [],
			embeds: [],
		});

		setTimeout(async () => {
			try {
				const attachment = await generateTranscript(channel);
				await channel.delete();
				await sendTranscriptInLogs(guild, attachment);
			} catch (error) {
				console.log(error);
			}
		}, 1000 * 5);
	} catch (error) {
		await handleInteractionError(error, interaction);
	}
};
