const { REST, Collection, ApplicationCommandType, Events, Routes } = require('discord.js');
const config = require('../config.js');
const { version } = require('os');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const table = new ascii("SlashCommand").setJustify();
const rest = new REST({ version: '10' }).setToken(config.bot.token);

module.exports = (client) => {
    const Commands = [];
    client.commands = new Collection(); 

    readdirSync('./SlashCommands').forEach(folder => {
        const commandFiles = readdirSync(`./SlashCommands/${folder}`).filter(file => file.endsWith(`.js`));
        for (const file of commandFiles) {
            const command = require(`../SlashCommands/${folder}/${file}`);
            if (command.name && command.description) {
                Commands.push({
                    type: ApplicationCommandType.ChatInput,
                    name: command.name,
                    description: command.description,
                    options: command.options || []
                });
                client.commands.set(command.name, command);
                table.addRow(`/${command.name}`, "✅  working");
            } else if (command.data?.name && command.data?.description) {
                Commands.push(command.data);
                client.commands.set(command.data.name, command);
                table.addRow(`/${command.data.name}`, "✅  working");
            } else {
                table.addRow(file, "❌ Not working");
            }
        }
    });
    console.log(table.toString());

    client.once(Events.ClientReady, async (c) => {
        try {
            const data = await rest.put(
                Routes.applicationCommands(c.user.id),
                { body: Commands }
            );
            console.log(`✅  Slash commands registered successfully in guild ${c.guilds.cache.first().name}`);
            console.log(`✅  ${Commands.length} slash commands sent to Discord API`);
        } catch (error) {
            console.error(error);
        }
    });
};
