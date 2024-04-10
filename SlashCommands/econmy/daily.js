const { SlashCommandBuilder } = require('discord.js');
const Balance = require('../../Database/models/coins.js');
const Canvas = require('canvas');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Give you coins'),

    async execute(interaction) {
        try {

            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const timeout = 86400000;

            const amount = Math.floor(Math.random() * 1000) + 1;
            let userBalance = await Balance.findOne({ userId });
            if (!userBalance) {
                userBalance = new Balance({
                    userId,
                    balance: 0,
                    lastClaim: null,
                });
            }

            if (userBalance.lastClaim && Date.now() - userBalance.lastClaim < timeout) {
                const timeRemaining = timeout - (Date.now() - userBalance.lastClaim);
                const hours = Math.floor(timeRemaining / 3600000);
                const minutes = Math.floor((timeRemaining % 3600000) / 60000);
                const seconds = Math.floor((timeRemaining % 60000) / 1000);

                return interaction.editReply(`:rolling_eyes: **| ${interaction.user.username}, your daily credits refreshes in ${hours}h ${minutes}m ${seconds}s.**`);
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
                userBalance.balance += amount;
                userBalance.lastClaim = Date.now();
                await userBalance.save();

                await interaction.followUp(`:moneybag: **${interaction.user.username}, you got :dollar: ${amount} daily credits!**`);
            } else {
                await interaction.followUp('You entered the wrong number.');
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while processing your claim.');
        }
    }
};
