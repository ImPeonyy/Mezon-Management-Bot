import { MezonClient } from "mezon-sdk";

export const onMessageEvent = (client: MezonClient) => {
    client.onChannelMessage((event) => {
        console.log(event);
    });
};