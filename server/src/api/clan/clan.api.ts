import { getClanWithEventMessages, getAllClans } from "@/repositories";
import { Request, Response } from "express";
import { ClanWithEventMessagesResponse, GetAllClansResponse } from "./clan.interface";

export const getAllClansAPI = async (
    req: Request,
    res: Response<GetAllClansResponse>
) => {
    try {
        const clans = await getAllClans();

        return res.status(200).json({
            success: true,
            message: "Get all clans successful",
            data: clans,
        });
    } catch (error) {
        console.error("Get all clans error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getClanWithEventMessagesAPI = async (
    req: Request<{ id: string }>,
    res: Response<ClanWithEventMessagesResponse>
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Clan ID is required",
            });
        }

        const clan = await getClanWithEventMessages(id);

        if (!clan) {
            return res.status(404).json({
                success: false,
                message: "Clan not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get clan with event messages successful",
            data: {
                id: clan.id,
                clan_name: clan.clan_name,
                welcome_channel_id: clan.welcome_channel_id,
                owner_id: clan.owner_id,
                created_at: clan.created_at,
                updated_at: clan.updated_at,
                event_messages: clan.event_messages,
            },
        });
    } catch (error) {
        console.error("Get clan with event messages error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
