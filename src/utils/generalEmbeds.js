// at the top of your file
const { EmbedBuilder } = require("discord.js");

function GeneralEmbed(title, desc) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0xffa500)
    .setTitle(title)
    .setDescription(desc);
  return exampleEmbed;
}

module.exports = {
  GeneralEmbed,
};
