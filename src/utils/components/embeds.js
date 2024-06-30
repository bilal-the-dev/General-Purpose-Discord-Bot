const { EmbedBuilder } = require("discord.js");

const generateGeneralEmbed = function ({
	title,
	url,
	description,
	fields,
	thumbnail,
	footer,
}) {
	const embed = new EmbedBuilder().setColor(0x000000);

	title && embed.setTitle(title);
	url && embed.setURL(url);
	description && embed.setDescription(description);
	thumbnail && embed.setThumbnail(thumbnail);
	fields && embed.addFields(...fields);
	footer && embed.setFooter(footer);
	return embed;
};

const generateTicketOpenEmbed = function (guild) {
	return generateGeneralEmbed({
		title: guild.name,
		description:
			"Si necesita ayuda, seleccione en el menú desplegable la opción que corresponde a su problema.",
		thumbnail: guild.iconURL(),
	});
};
const generateTicketCloseEmbed = function (user) {
	return generateGeneralEmbed({
		title: "Ticket Support",
		description:
			"Please be patient while the staff approaches and solve your issue",
		thumbnail: user.displayAvatarURL(),
	});
};

module.exports = {
	generateTicketOpenEmbed,
	generateGeneralEmbed,
	generateTicketCloseEmbed,
};
