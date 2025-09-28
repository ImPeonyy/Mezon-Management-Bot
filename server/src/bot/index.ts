import { MezonClient } from "mezon-sdk";
import { onWelcomeEvent } from "./events/on-welcome/onWelcome.event";
import { onMessageEvent } from "./events/on-message/onMessage.event";
import { onGoodbyeEvent } from "./events/on-goodbye/onGoodbye.event";

export const onEventListeners = (client: MezonClient) => {
    onWelcomeEvent(client);
    onMessageEvent(client);
    onGoodbyeEvent(client);
};