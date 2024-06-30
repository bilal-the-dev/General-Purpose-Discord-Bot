require("dotenv").config();

module.exports = (client) => {
	// client.application.commands.set([]);
	// client.guilds.cache.get("1218982026330243143").commands.set([]);
	console.log(`${client.user.tag} is online.`);
};
