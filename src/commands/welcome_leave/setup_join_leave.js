const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const parentDir = path.join(__dirname, "..", "..", "..");
const filePath = path.join(parentDir, "welcome_leave.json");

const {
	handleInteractionError,
	replyOrEditInteraction,
} = require("../../utils/interaction");
const config = require("../../../welcome_leave.json");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = {
	name: "setup_join_leave",
	description: "🔴 [ADMIN] Configurar mensajes de salida o bienvenida",
	options: [
		{
			name: "type",
			description: "salir o dar la bienvenida",
			type: ApplicationCommandOptionType.String,

			required: true,
			choices: [
				{ name: "bienvenido", value: "welcome_message" },
				{ name: "dejar", value: "leave_message" },
			],
		},
		{
			name: "mensaje",
			description: "Welcome ${user} to ${server}",
			type: ApplicationCommandOptionType.String,

			required: true,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (_, interaction) => {
		try {
			const { options, user, channel } = interaction;

			await interaction.deferReply();

			const messageType = options.getString("type");
			const text = options.getString("message");
			let attachment;

			await replyOrEditInteraction(
				interaction,
				"Por favor envíe la imagen/video que desea configurar"
			);

			const collectorFilter = (m) => m.author.id === user.id;

			const collector = channel.createMessageCollector({
				filter: collectorFilter,
				time: 1000 * 60 * 2,
			});

			collector.on("collect", (m) => {
				attachment = m.attachments.first()?.attachment;
				if (!attachment) return;
				console.log(attachment);
				collector.stop();
			});

			collector.on("end", async () => {
				if (!attachment)
					return await channel.send(
						"Se agotó el tiempo de espera, ejecute el comando nuevamente."
					);

				config[messageType] = { attachment, text };

				fs.writeFileSync(filePath, JSON.stringify(config));
				await channel.send("¡El éxito guardó la configuración!");
			});
		} catch (error) {
			await handleInteractionError(error, interaction);
		}
	},
};
