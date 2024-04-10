const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../Database/models/Profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('title')
        .setDescription('Change your title')
        .addStringOption(option =>
            option.setName('new_title')
                .setDescription('Enter your new title')
                .setRequired(true)),

    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;

            const newTitle = interaction.options.getString('new_title');

            await Profile.findOneAndUpdate({ userID: userID }, { biography: newTitle }, { upsert: true });

            interaction.reply(`Your title has been updated to: ${newTitle}`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while updating your title.');
        }
    },
};
