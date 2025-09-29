import { EEvent, Prisma, PrismaClient } from "@prisma/client";

export const createEventMessage = async (
    prismaClient: PrismaClient | Prisma.TransactionClient,
    clanId: string,
    event: EEvent,
    template: string
) => {
    try {
        return await prismaClient.eventMessage.create({
            data: { clan_id: clanId, event, template },
        });
    } catch (error) {
        console.error("Error creating event message", error);
    }
};

export const updateEventMessage = async (
    prismaClient: PrismaClient | Prisma.TransactionClient,
    id: number,
    template: string
) => {
    try {
        return await prismaClient.eventMessage.update({
            where: { id },
            data: { template },
        });
    } catch (error) {
        console.error("Error updating event message", error);
    }
};