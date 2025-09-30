import { SETUP_EVENT_MESSAGE_TEMPLATES } from "@/bot/commands";
import { getClanWithEventMessages } from "@/repositories";
import { getAIGoodbyeMessage } from "@/services/openAI.service";
import { textMessage, replacePlaceholders } from "@/utils";
import { EEvent } from "@prisma/client";
import { MezonClient } from "mezon-sdk";

export const onGoodbyeEvent = (client: MezonClient) => {
    client.onUserClanRemoved(async (event: any) => {
        const { clan_id } = event;
        const clan = await getClanWithEventMessages(clan_id);

        if (clan && clan.event_messages) {
            const welcomeChannel = await client.channels.fetch(
                clan.welcome_channel_id
            );

            const goodbyeEvent = clan.event_messages.find(
                (message) => message.event === EEvent.CLAN_LEAVE
            );

            let rawMessage = goodbyeEvent?.template;
            if (goodbyeEvent?.is_AI_gen) {
                rawMessage = await getAIGoodbyeMessage();
            }

            const goodbyeMessage = replacePlaceholders(
                rawMessage ?? SETUP_EVENT_MESSAGE_TEMPLATES.CLAN_LEAVE,
                {
                    clan: clan.clan_name,
                }
            );

            await welcomeChannel.send(textMessage(goodbyeMessage));
        } else {
            console.error("Clan not found or event messages not found");
            return;
        }
    });
};
