import { COMMANDS, setupController } from "@/bot/commands";    
import { TRIGGER_WORD } from "@/constants";
import { parseActionCommand } from "@/utils";
import { MezonClient } from "mezon-sdk";

export const onMessageEvent = (client: MezonClient) => {
    client.onChannelMessage(async (event: any) => {
        try {
            const { trigger, action, targetRaw } = parseActionCommand(
                event.content.t
            );

            if (trigger === TRIGGER_WORD) {
                const { channel_id, message_id } = event;
                const channelFetch = await client.channels.fetch(channel_id);
                const messageFetch = await channelFetch.messages.fetch(message_id);
                
                switch (action) {
                    case COMMANDS.SETUP:
                        await setupController(client, event, messageFetch, channelFetch);
                        break;

                    default:
                        break;
                }
            }
        } catch (error) {
            console.error("Error on message event", error);
        }
    });
};
