import { SETUP_EVENT_MESSAGE_TEMPLATES } from "@/bot/commands/setup/setup.constants";
import { getClanWithEventMessages } from "@/repositories";
import { getWelcomeMessage, textMessage } from "@/utils";
import { replacePlaceholders } from "@/utils/misc.util";
import { EEvent } from "@prisma/client";
import { MezonClient } from "mezon-sdk";

export const onWelcomeEvent = (client: MezonClient) => {
    client.onAddClanUser(async (event: any) => {
        try {
            const { clan_id, user } = event;
            
            if (!clan_id || !user) {
                console.error("Missing clan_id or user in welcome event");
                return;
            }

            const clan = await getClanWithEventMessages(clan_id);
            
            if (!clan) {
                console.error(`Clan not found for clan_id: ${clan_id}`);
                return;
            }

            if (!clan.event_messages || clan.event_messages.length === 0) {
                console.error(`No event messages found for clan: ${clan.clan_name} (${clan_id})`);
                return;
            }

            const welcomeChannel = await client.channels.fetch(
                clan.welcome_channel_id
            );

            const welcomeEvent = clan.event_messages.find(
                (message) => message.event === EEvent.CLAN_JOIN
            );

            const welcomeMessage = replacePlaceholders(
                welcomeEvent?.template ?? SETUP_EVENT_MESSAGE_TEMPLATES.CLAN_JOIN,
                {
                    user: user.display_name,
                    clan: clan.clan_name,
                }
            );

            await welcomeChannel.send(getWelcomeMessage(welcomeMessage, user.avatar));
        } catch (error) {
            console.error("Error in onWelcomeEvent:", error);
        }
    });
};
