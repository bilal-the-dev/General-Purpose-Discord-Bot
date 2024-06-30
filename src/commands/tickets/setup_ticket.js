const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const parentDir = path.join(__dirname, "..", "..", "..");
const filePath = path.join(parentDir, "ticket.json");

const {
	handleInteractionError,
	replyOrEditInteraction,
} = require("../../utils/interaction");
const config = require("../../../ticket.json");
const {
	generateTicketOpenEmbed,
	generateGeneralEmbed,
} = require("../../utils/components/embeds");
const { generateTicketOpenButton } = require("../../utils/components/button");
/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = {
	name: "setup_ticket",
	description: "🔴 [ADMIN] Configurar sistema de tickets",
	options: [
		{
			name: "channel",
			description: "channel donde se enviará la embed",
			type: ApplicationCommandOptionType.Channel,
			required: true,
		},
		{
			name: "transcripción_channel",
			description: "channel donde se enviarán las transcripciones",
			type: ApplicationCommandOptionType.Channel,
			required: true,
		},
		{
			name: "staff_role",
			description: "role que se hará ping cuando se abra el ticket",
			type: ApplicationCommandOptionType.Role,

			required: true,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (_, interaction) => {
		try {
			const { options, guild } = interaction;

			await interaction.deferReply({ ephemeral: true });

			const channel = options.getChannel("transcripción_channel");
			const embedChannel = options.getChannel("channel");
			const { id: roleId } = options.getRole("staff_role");

			config.STAFF_ROLE_ID = roleId;
			config.TRANSCRIPT_CHANNEL_ID = channel.id;

			const embed = generateTicketOpenEmbed(guild);
			const dropdown = generateTicketOpenButton();

			const successEmbeds = generateGeneralEmbed({
				title: "Éxito!",
				description: "Los ajustes han sido configurados.",
			});

			fs.writeFileSync(filePath, JSON.stringify(config));

			await embedChannel.send({
				embeds: [embed],
				components: [dropdown],
			});

			await replyOrEditInteraction(interaction, { embeds: [successEmbeds] });
		} catch (error) {
			await handleInteractionError(error, interaction);
		}
	},
};
