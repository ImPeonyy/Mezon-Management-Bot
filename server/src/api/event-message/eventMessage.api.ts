import { updateEventMessage } from "@/repositories";
import { Request, Response } from "express";
import { ApiResponse } from "@/constants";
import { prisma } from "@/clients/prisma";

export const updateEventMessageAPI = async (
    req: Request<{ id: string; template: string }>,
    res: Response<ApiResponse>
) => {
    try {
        const { id } = req.params;
        const { template } = req.body;

        if (!id || !template) {
            return res.status(400).json({
                success: false,
                message: "Clan ID and template are required",
            });
        }

        const eventMessage = await updateEventMessage(prisma, Number(id), template);

        if (!eventMessage) {
            return res.status(404).json({
                success: false,
                message: "Event message not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Update event message successful",
            data: eventMessage,
        });
    } catch (error) {
        console.error("Update event message error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
