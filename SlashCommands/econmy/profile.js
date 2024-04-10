const { SlashCommandBuilder } = require('discord.js');
const { Canvas, resolveImage } = require('canvas-constructor');
const canvas = require('canvas');
const { registerFont } = require('canvas');

registerFont("./TT.otf", { family: 'TT' });
const Balance = require('../../Database/models/coins.js');
const Profile = require('../../Database/models/Profile.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Display user profile image with their username.')
        .addUserOption(option => option.setName('user').setDescription('The user to display their profile').setRequired(false)),

    async execute(interaction, client) {
        const userOption = interaction.options.get('user');
        const user = userOption ? userOption.user : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        try {
            const balanceData = await Balance.findOne({ userId: user.id });
            const coins = balanceData ? balanceData.balance : 0;

            const profileData = await Profile.findOne({ userID: user.id });
            const title = profileData ? profileData.biography : 'No title available';

            const img = await canvas.loadImage('imgs/Img1.png'); 
            let userPfp = await resolveImage(user.displayAvatarURL({ extension: "jpg", size: 1024 }));
            let namee = user.tag;

            let image = new Canvas(500, 500)
                .printImage(img, 0, 0, 500, 500)
                .setColor(`#fff`)
                .setTextFont('40px Arial')
                .printWrappedText(namee, 200, 100)
                .printCircularImage(userPfp, 100, 100, 80, 80)
                .setColor('#ffffff')
                .setTextAlign('center')
                .setTextFont('40px Arial')
                .printText(`${title}`, 250, 250)
                .printText(`${coins}`, 250, 350)
                .toBuffer();

            interaction.reply({ files: [image] });
        } catch (error) {
            console.error('Error occurred while processing profile command:', error);
            interaction.reply('An error occurred while processing your request.');
        }
    },
};

