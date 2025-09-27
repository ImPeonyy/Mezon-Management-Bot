import { MezonClient } from "mezon-sdk";

export const onWelcomeEvent = (client: MezonClient) => {
    client.onAddClanUser((event) => {
        console.log(event);
    });
};