const { SlashCommandBuilder } = require('discord.js');
const Balance = require('../../Database/models/coins.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('coins')
        .setDescription('Show your coins')
        .addUserOption(option => option.setName('target').setDescription('User to check')),

        async execute(interaction, client) {
            try {
               
                let targetUser = interaction.options.getUser('target') || interaction.user;
                const targetUserId = targetUser.id;
    
                let targetBalance = await Balance.findOne({ userId: targetUserId });
    
                if (!targetBalance) {
                    targetBalance = new Balance({
                        userId: targetUserId,
                        balance: 0,
                        lastClaim: null,
                    });
                    await targetBalance.save();
                }
    
                interaction.reply(`:moneybag: **${targetUser.username}, the current balance is :dollar: ${targetBalance.balance}**`);
            } catch (error) {
                console.error(error);
                interaction.reply('An error occurred while retrieving the balance.');
            }
        },
    };