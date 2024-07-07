const { generateTicketCloseButton } = require("../../utils/components/button");
const {
	generateGeneralEmbed,
	generateTicketCloseEmbed,
} = require("../../utils/components/embeds");
const {
	handleInteractionError,
	replyOrEditInteraction,
} = require("../../utils/interaction");
const {
	createTicketChannel,
	deletePreviousTickets,
} = require("../../utils/misc");
const config = require("../../../ticket.json");
module.exports = async (_, interaction) => {
	try {
		if (!interaction.isStringSelectMenu()) return;

		const { customId, client, user, guild } = interaction;

		if (customId !== "openTicket") return;

		await interaction.deferReply({ ephemeral: true });

		await deletePreviousTickets(client, user.id);

		const channel = await createTicketChannel(guild, user);

		const embed = generateTicketCloseEmbed(user);
		const button = generateTicketCloseButton();
		const successEmbed = generateGeneralEmbed({
			title: "Éxito!",
			description: `Éxito, tu ticket ha sido abierto ${channel}`,
		});

		await channel.send({
			content: `<@&${config.STAFF_ROLE_ID}>`,
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
