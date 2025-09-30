import { ChannelMessageContent, IInteractiveMessageProps } from "mezon-sdk/dist/cjs/interfaces/client";
import { getRandomPastelHexColor } from "@/utils";

export const textMessage = (message: string) => {
    const messagePayload: ChannelMessageContent = {
        t: message
    };

    return messagePayload;
};

export const getWelcomeMessage = (message: string, avatarUrl?: string) => {
    const embedConfig: IInteractiveMessageProps[] = [
        {
            color: getRandomPastelHexColor(),
            image: {
                url: avatarUrl ?? ""
            }
        }
    ];
    const messagePayload: ChannelMessageContent = {
        t: message,
        embed: avatarUrl ? embedConfig : undefined
    };
    
    return messagePayload;
};