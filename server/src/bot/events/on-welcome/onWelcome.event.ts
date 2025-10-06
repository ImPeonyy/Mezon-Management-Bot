import { SETUP_EVENT_MESSAGE_TEMPLATES } from "@/bot/commands/setup/setup.constants";
import { getClanWithEventMessages } from "@/repositories";
import { getAIWelcomeMessage } from "@/services/openAI.service";
import {
    getWelcomeMessage,
    getMentionPosition,
    replacePlaceholders,
} from "@/utils";
import { EEvent } from "@prisma/client";
import { MezonClient } from "mezon-sdk";

export const onWelcomeEvent = (client: MezonClient) => {
    client.onAddClanUser(async (event: any) => {
        const { clan_id, user } = event;
        const clan = await getClanWithEventMessages(clan_id);
        if (clan && clan.event_messages) {
            const welcomeChannel = await client.channels.fetch(
                clan.welcome_channel_id
            );

            const welcomeEvent = clan.event_messages.find(
                (message) => message.event === EEvent.CLAN_JOIN
            );

            let rawMessage = welcomeEvent?.template;
            if (welcomeEvent?.is_AI_gen) {
                rawMessage = await getAIWelcomeMessage();
            }

            const welcomeMessage = replacePlaceholders(
                rawMessage ?? SETUP_EVENT_MESSAGE_TEMPLATES.CLAN_JOIN,
                {
                    user: `@${user.display_name}`,
                    clan: clan.clan_name,
                }
            );

            const mentionPosition = getMentionPosition(welcomeMessage, user.display_name);

            await welcomeChannel.send(
                getWelcomeMessage(welcomeMessage, welcomeEvent?.has_avatar ? user.avatar : null),
                [
                    {
                        user_id: user.user_id,
                        s: mentionPosition?.start,
                        e: mentionPosition?.end,
                    },
                ]
            );
        } else {
            console.error("Clan not found or event messages not found");
            return;
        }
    });
};
