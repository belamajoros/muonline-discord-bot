require('dotenv').config()
const Discord = require('discord.js');
const { Client, IntentsBitField } = require('discord.js');
const axios = require('axios');
const API_URL = 'https://mu-finder-api.onrender.com';

const client = new Client(
    { intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent]
    });

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

client.on('messageCreate', async (msg) => {
    if(msg.author.bot) return;
    console.log(msg.content)
    if (msg.content.startsWith('find ')) {
      const userName = msg.content.substring(5).trim();
      if(userName.length === 0) {
        msg.reply('Please provide an existing character name');
      }
      try {
        const response = await axios.get(`${API_URL}${userName}`);
        if(response.status !== 200) {
          msg.reply(response.data.error)
          return;
        }
        const buffer = new Buffer.from(response.data.result.split(",")[1], "base64");
        const attachment = new Discord.AttachmentBuilder(buffer, { name: 'image.jpg' })
        msg.channel.send({ files: [attachment] });
      } catch (error) {
        console.log(error.response.data.error);
        msg.reply(error.response.data.error)
      }
    }
});

client.login(process.env.TOKEN);
