import dotenv from 'dotenv';
import { MezonClient } from 'mezon-sdk';
import express from 'express';
import cors from 'cors';
import { onEventListeners } from '@/bot'; 
import routes from '@/routes';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', routes);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

async function main() {
    const client = new MezonClient({
        token: process.env.BOT_TOKEN as string,
        botId: process.env.BOT_ID as string,
    });
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
