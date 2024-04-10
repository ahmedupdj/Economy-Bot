const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help') 
        .setDescription('help Command'), 
        async execute(interaction, client) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Economy Bot')
                .setDescription(`
                **Economy Commands:**
                > /daily - give you coins
                > /coins - show your coins
                > /transformation - transformation to user
                > /profile - show profile
                > /mytransfers - your transformation log
                `)
                .setThumbnail(interaction.user.displayAvatarURL())

                .setImage('https://cdn.discordapp.com/attachments/716886898978586677/1210729354410065940/image.png?ex=66108894&is=65fe1394&hm=acb08f0e784c59e09b42466de493c54ab57779cb67ee2c378b3ad235c457e084&')
                .setTimestamp()
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() }); 

            
            interaction.channel.send({ embeds: [exampleEmbed] })
                .catch(console.error);
        }
        
};
