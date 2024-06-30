require("dotenv").config();

module.exports = (client) => {
	client.application.commands.set([]);
	console.log(`${client.user.tag} is online.`);
};
