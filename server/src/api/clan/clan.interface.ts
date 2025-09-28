import { EventMessage } from "@prisma/client";

export interface GetAllClansResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        clan_name: string;
        welcome_channel_id: string;
        owner_id: string;
        created_at: Date;
        updated_at: Date;
    }[];
}

export interface ClanWithEventMessagesResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        clan_name: string;
        welcome_channel_id: string;
        owner_id: string;
        created_at: Date;
        updated_at: Date;
        event_messages: EventMessage[];
    };
}