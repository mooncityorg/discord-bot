
import express from 'express';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PORT = process.env.PORT || 3000;

// Discord bot setup
client.once('ready', () => {
    console.log('Discord bot is ready!');

    // Function to send message
    const sendMessage = async () => {
        try {
            const channel = await client.channels.fetch(CHANNEL_ID!);
            if (channel && channel instanceof TextChannel) {
                await channel.send('https://x.com/0xMooncity/status/1881679347670536260');
                console.log('Message sent successfully!');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Send message every 10 seconds
    setInterval(sendMessage, 1000);
});

// Express server setup
app.get('/', (req, res) => {
    res.send('Discord bot is running!');
});

// Start the server and bot
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Login Discord bot
    client.login(DISCORD_TOKEN).catch(error => {
        console.error('Error logging in to Discord:', error);
    });
});