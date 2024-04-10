const { Events, InteractionType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',  
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({ content: `Command not found: ${interaction.commandName}`, ephemeral: true });

            try {
                await command.execute(interaction, client);
            } catch(error) {
                console.error(error);
                interaction.reply({ content: `An error occurred while executing the command: ${interaction.commandName}`, ephemeral: true });
            }
        }
    }
}
