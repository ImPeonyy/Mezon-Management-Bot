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

export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
    try {
        // Tìm user và verify current password
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Verify current password
        const isCurrentPasswordValid = await argon2.verify(user.password, currentPassword);
        
        if (!isCurrentPasswordValid) {
            return { success: false, message: "Current password is incorrect" };
        }

        // Hash new password
        const hashedNewPassword = await argon2.hash(newPassword);

        // Update password
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedNewPassword,
                updated_at: new Date(),
            },
        });

        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        console.error("Error changing password", error);
        return { success: false, message: "Internal server error" };
    }
};