const { SlashCommandBuilder } = require('discord.js');
const Balance = require('../../Database/models/coins.js');
const Canvas = require('canvas');

const Transfer = require('../../Database/models/transfer.js'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transformation')
        .setDescription('Transfer coins to another user')
        .addUserOption(option => option.setName('target').setDescription('User to transfer to').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of coins to transfer').setRequired(true)),

    async execute(interaction) {
        try {

        
            await interaction.deferReply({ ephemeral: true });

            const userBalance = await Balance.findOne({ userId: interaction.user.id });

            if (!userBalance || userBalance.balance <= 0) {
                return interaction.editReply({ content: 'You don\'t have any coins to transfer.' });
            }

            const targetUser = interaction.options.getUser('target');
            const amount = interaction.options.getInteger('amount');

            if (!targetUser || !amount || amount <= 0) {
                return interaction.editReply({ content: 'Invalid parameters. Please provide a valid target user and a positive amount.' });
            }

            if (userBalance.balance < amount) {
                return interaction.editReply({ content: 'You don\'t have enough coins to transfer this amount.' });
            }

            const canvas = Canvas.createCanvas(200, 100);
            const context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);

            const randomNumber = Math.floor(Math.random() * 100000);
            context.fillStyle = '#000000'; 
            context.font = '30px Arial';
            context.fillText(randomNumber, 10, 50);

            await interaction.editReply({ files: [canvas.toBuffer()] });

            const filter = m => m.author.id === interaction.user.id;
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] });

            const userNumber = parseInt(collected.first().content);

            if (userNumber === randomNumber) {
                userBalance.balance -= amount;
                await userBalance.save();

                const targetBalance = await Balance.findOneAndUpdate(
                    { userId: targetUser.id },
                    { $inc: { balance: amount } },
                    { upsert: true, new: true }
                );

                const transfer = new Transfer({
                    senderId: interaction.user.id,
                    receiverId: targetUser.id,
                    amount: amount,
                    timestamp: new Date()
                });
                await transfer.save();

                await targetUser.send(`:moneybag: **You received :dollar: ${amount} from ${interaction.user.toString()}.**`);

                await interaction.followUp(`:moneybag: **You transferred :dollar: ${amount} to ${targetUser.toString()}.**`);
            } else {
                await interaction.followUp('You entered the wrong number.');
            }
        } catch (error) {
            console.error(error);
            await interaction.followUp('The transfer has been cancelled.');
        }
    },
};
