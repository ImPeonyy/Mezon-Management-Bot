import { DEFAULT_PASSWORD } from "@/constants";
import { prisma } from "@/clients/prisma";
import { Prisma, PrismaClient } from "@prisma/client";

export const setupClan = async (
    prismaClient: PrismaClient | Prisma.TransactionClient,
    clanId: string,
    clanName: string,
    ownerId: string,
    username: string,
    welcomeChannelId: string
) => {
    try {
        return await prismaClient.clan.create({
            data: {
                id: clanId,
                clan_name: clanName,
                welcome_channel_id: welcomeChannelId,
                owner: {
                    connectOrCreate: {
                        where: { id: ownerId },
                        create: { id: ownerId, password: DEFAULT_PASSWORD, username },
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error setting up clan", error);
    }
};

export const getClan = async (clanId: string) => {
    try {
        return await prisma.clan.findUnique({
            where: { id: clanId },
        });
    }
    catch (error) {
        console.error("Error getting clan", error);
    }
};

export const getAllClans = async () => {
    try {
        return await prisma.clan.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });
    } catch (error) {
        console.error("Error getting all clans", error);
        return [];
    }
};

export const getClanWithEventMessages = async (clanId: string) => {
    try {
        return await prisma.clan.findUnique({
            where: { id: clanId },
            include: {
                event_messages: true,
            },
        });
    } catch (error) {
        console.error("Error getting clan with event messages", error);
        return null;
    }
};