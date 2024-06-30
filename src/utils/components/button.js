const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const generateGeneralButton = function (label, id, style) {
	const button = new ButtonBuilder()
		.setCustomId(id)
		.setLabel(label)
		.setStyle(ButtonStyle[style]);

	return button;
};

const generateTicketOpenButton = () =>
	new ActionRowBuilder().addComponents(
		generateGeneralButton("¡Abra un boleto!", "openTicketButton", "Danger")
	);
const generateTicketCloseButton = () =>
	new ActionRowBuilder().addComponents(
		generateGeneralButton("cerrar", "closeTicket", "Danger")
	);

const generateConfirmationButtons = function () {
	const confirm = generateGeneralButton("confirm", "confirmClose", "Danger");
	const cancel = generateGeneralButton("cancel", "cancelClose", "Success");
	return new ActionRowBuilder().addComponents(confirm, cancel);
};

module.exports = {
	generateTicketCloseButton,
	generateConfirmationButtons,
	generateTicketOpenButton,
};
