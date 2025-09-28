import { prisma } from "@/clients/prisma";
import * as argon2 from "argon2";


export const authenticateUser = async (userId: string, password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        
        if (!isPasswordValid) {
            return null;
        }

        // Trả về user nhưng không bao gồm password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error authenticating user", error);
        return null;
    }
};