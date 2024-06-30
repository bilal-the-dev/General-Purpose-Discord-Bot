const { generateTicketCloseButton } = require("../../utils/components/button");
const {
	generateGeneralEmbed,
	generateTicketCloseEmbed,
} = require("../../utils/components/embeds");
const {
	handleInteractionError,
	replyOrEditInteraction,
} = require("../../utils/interaction");
const { createTicketChannel } = require("../../utils/misc");
const config = require("../../../ticket.json");
module.exports = async (_, interaction) => {
	try {
		if (!interaction.isStringSelectMenu()) return;

		const { customId, values, user, guild } = interaction;

		if (customId !== "openTicket") return;

		await interaction.deferReply({ ephemeral: true });

		const channel = await createTicketChannel(guild, values[0], user);

		const embed = generateTicketCloseEmbed(user);
		const button = generateTicketCloseButton();
		const successEmbed = generateGeneralEmbed({
			title: "Éxito!",
			description: `Éxito, tu ticket ha sido abierto ${channel}`,
		});

		await channel.send({
			content: `<@&${config.STAFF_ROLE_ID}> ${user}`,
			embeds: [embed],
			components: [button],
		});

		await replyOrEditInteraction(interaction, {
			embeds: [successEmbed],
		});
	} catch (error) {
		await handleInteractionError(error, interaction);
	}
};
