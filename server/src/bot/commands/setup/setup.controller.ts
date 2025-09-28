import {
    createEventMessage,
    getClan,
    getUser,
    setupClan,
} from "@/repositories";
import { textMessage } from "@/utils";
import { EEvent } from "@prisma/client";
import { MezonClient } from "mezon-sdk";
import { Clan } from "mezon-sdk/dist/cjs/mezon-client/structures/Clan";
import { Message } from "mezon-sdk/dist/cjs/mezon-client/structures/Message";
import { SETUP_EVENT_MESSAGE_TEMPLATES } from "./setup.constants";
import { prisma } from "@/clients/prisma";

export const setupController = async (
    client: MezonClient,
    event: any,
    messageFetch: Message,
    channelFetch: any
) => {
    const { clan_id, sender_id, username } = event;
    let messageReply;
    try {
        const clan = await getClan(clan_id);

        if (!clan) {
            const message = await messageFetch.reply(
                textMessage("Setting up Peo~...")
            );
            messageReply = await channelFetch.messages.fetch(
                message.message_id
            );

            const clan = client.clans.get(clan_id);
            const { name, welcome_channel_id } = clan as Clan;
            await prisma.$transaction(async (tx) => {
                await setupClan(
                    tx,
                    clan_id,
                    name,
                    sender_id,
                    username,
                    welcome_channel_id
                );
                await createEventMessage(
                    tx,
                    clan_id,
                    EEvent.CLAN_JOIN,
                    SETUP_EVENT_MESSAGE_TEMPLATES.CLAN_JOIN
                );
                await createEventMessage(
                    tx,
                    clan_id,
                    EEvent.CLAN_LEAVE,
                    SETUP_EVENT_MESSAGE_TEMPLATES.CLAN_LEAVE
                );
            });

            await messageReply.update(textMessage("Successfully setup Peo~!"));
        } else {
            return;
        }
    } catch (error) {
        console.error("Error in setup command", error);
        if (messageReply) {
            await messageReply.update(textMessage("Error in setup Peo~"));
        } else {
            await messageFetch.reply(textMessage("Error in setup Peo~"));
        }
    }
};
