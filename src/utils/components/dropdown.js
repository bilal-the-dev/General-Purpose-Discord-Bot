const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

const { categories } = require("../../../ticket.json");

const generateTicketDropDown = function () {
  const options = Object.entries(categories).map((category) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(category[0])
      .setDescription(category[1].description)
      .setValue(category[1].categoryId)
      .setEmoji(category[1].icon)
  );

  const select = new StringSelectMenuBuilder()
    .setCustomId("openTicket")
    .setPlaceholder("Make a selection!")
    .addOptions(...options);
  const row = new ActionRowBuilder().addComponents(select);

  return row;
};

module.exports = { generateTicketDropDown };
