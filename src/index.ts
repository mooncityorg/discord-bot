
import express from 'express';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import TwitterApi from 'twitter-api-v2'
import { env } from 'process';
import { BEARER_TOKEN } from './constants/index';
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
const user = new TwitterApi(BEARER_TOKEN)
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
async function getUserTweets(userId: any) {
    try {
        // Get user tweets using v2 endpoint
        // This endpoint allows fetching up to 3200 of a user's most recent tweets
        const tweets = await user.v2.userTimeline(userId, {
            // Tweet fields to retrieve
            "tweet.fields": [
                "created_at",
                "text",
                "public_metrics",
                "referenced_tweets",
                "attachments"
            ],
            // Maximum results per request (100 is max)
            max_results: 100,
            // Set to true to exclude retweets and replies
            exclude: ['retweets', 'replies']
        });

        // Initialize array to store all tweets
        const allTweets = [];

        // Fetch all available tweets using pagination
        for await (const tweet of tweets) {
            allTweets.push(tweet);
        }

        return allTweets;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        throw error;
    }
}

// Example usage
async function main() {
    // Elon Musk's Twitter ID
    const elonMuskId = '44196397';

    try {
        const tweets = await getUserTweets(elonMuskId);
        console.log(`Retrieved ${tweets.length} tweets`);

        // Process each tweet
        tweets.forEach(tweet => {
            console.log(`Tweet at ${tweet.created_at}: ${tweet.text}`);
            console.log('Metrics:', tweet.public_metrics);
            console.log('---');
        });
    } catch (error) {
        console.error('Failed to fetch tweets:', error);
    }
}


main();
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