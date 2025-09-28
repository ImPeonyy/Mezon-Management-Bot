import { prisma } from "@/clients/prisma";

export const getUser = async (userId: string) => {
    try {
        return await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    } catch (error) {
        console.error("Error getting user", error);
        return null;
    }
};