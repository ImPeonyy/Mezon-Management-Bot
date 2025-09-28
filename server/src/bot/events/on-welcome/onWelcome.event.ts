import { SETUP_EVENT_MESSAGE_TEMPLATES } from "@/bot/commands/setup/setup.constants";
import { getClanWithEventMessages } from "@/repositories";
import { getWelcomeMessage, textMessage } from "@/utils";
import { replacePlaceholders } from "@/utils/misc.util";
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

            const welcomeMessage = replacePlaceholders(
                clan.event_messages.find(
                    (message) => message.event === EEvent.CLAN_JOIN
                )?.template ?? SETUP_EVENT_MESSAGE_TEMPLATES.CLAN_JOIN,
                {
                    user: user.display_name,
                    clan: clan.clan_name,
                }
            );

            await welcomeChannel.send(getWelcomeMessage(welcomeMessage, user.avatar));
        } else {
            console.error("Clan not found or event messages not found");
            return;
        }
    });
};
