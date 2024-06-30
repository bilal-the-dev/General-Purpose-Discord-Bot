const { PermissionFlagsBits } = require("discord.js");
const {
	generateConfirmationButtons,
} = require("../../utils/components/button");
const { generateGeneralEmbed } = require("../../utils/components/embeds");
const {
	handleInteractionError,
	replyOrEditInteraction,
} = require("../../utils/interaction");

module.exports = async (client, interaction) => {
	try {
		if (!interaction.isButton()) return;

		const { customId, member } = interaction;

		if (customId !== "closeTicket") return;

		await interaction.deferReply({ ephemeral: true });

		if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
			throw new Error(
				"No está autorizado a utilizar este botón. Este botón está limitado a administradores."
			);
		}

		const buttons = generateConfirmationButtons();

		const embed = generateGeneralEmbed({
			title: "Mensaje de confirmacion",
			description: `¿Estás seguro de que quieres cerrar el ticket?`,
		});

		await replyOrEditInteraction(interaction, {
			embeds: [embed],
			components: [buttons],
			ephemeral: true,
		});
	} catch (error) {
		await handleInteractionError(error, interaction);
	}
};
