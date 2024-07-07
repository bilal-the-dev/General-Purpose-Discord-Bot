const { generateTicketDropDown } = require("../../utils/components/dropdown");
const { generateGeneralEmbed } = require("../../utils/components/embeds");
const {
	replyOrEditInteraction,
	handleInteractionError,
} = require("../../utils/interaction");

module.exports = async (client, interaction) => {
	try {
		if (!interaction.isButton()) return;

		const { customId } = interaction;

		if (customId !== "openTicketButton") return;

		await interaction.deferReply({ ephemeral: true });

		const embed = generateGeneralEmbed({
			title: "Seleccione la Asistencia técnica",
			description: `Selecciona la opción adecuada acorde a tu duda o inconveniente`,
		});
		const row = generateTicketDropDown();

		await replyOrEditInteraction(interaction, {
			embeds: [embed],
			components: [row],
		});
	} catch (error) {
		await handleInteractionError(error, interaction);
	}
};
