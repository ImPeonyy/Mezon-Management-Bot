import dotenv from 'dotenv';
import { MezonClient } from 'mezon-sdk';
import express from 'express';
import cors from 'cors';
import { onEventListeners } from '@bot/index';


dotenv.config();

const app = express();

app.use(cors());

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

async function main() {
    const client = new MezonClient(process.env.BOT_TOKEN);
    await client.login();

    // on event listeners
    onEventListeners(client);

    
}

main()
    .then(() => {
        console.log('bot start!');
    })
    .catch((error) => {
        console.error('Error starting bot:', error);
    });

export default app;
