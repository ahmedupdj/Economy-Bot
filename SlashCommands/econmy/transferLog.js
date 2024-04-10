const { SlashCommandBuilder } = require('discord.js');

const Transfer = require('../../Database/models/transfer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mytransfers')
        .setDescription('View all transfers made to you'),

    async execute(interaction) {
        try {
            const transfers = await Transfer.find({ receiverId: interaction.user.id });

            if (transfers.length === 0) {
                await interaction.reply('No transfers found for you.');
                return;
            }

            let replyMessage = 'Your transfers:\n';
            transfers.forEach((transfer, index) => {
                replyMessage += `${index + 1}. Amount: ${transfer.amount}, Sender: <@${transfer.senderId}>, Time: ${transfer.timestamp}\n`;
            });

            await interaction.reply(replyMessage);
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching transfers.');
        }
    },
};
