import { MezonClient } from "mezon-sdk";
import { onWelcomeEvent } from "./events/on-welcome/onWelcome.event";

export const onEventListeners = (client: MezonClient) => {
    onWelcomeEvent(client);
};