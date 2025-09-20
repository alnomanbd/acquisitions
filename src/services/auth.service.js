import { db } from "#config/database.js";
import logger from "#config/logger.js";
import { users } from "#models/user.model.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error(`Error hashing password: ${error}`);
        throw new Error("Error hashing password");
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error(`Error comparing password: ${error}`);
        throw new Error("Error comparing password");
    }
}

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            throw new Error("User with this email already exists");
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                role
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at
            });

        logger.info(`User ${newUser.email} created successfully`);

        return newUser;
    } catch (error) {
        logger.error(`Error creating user: ${error}`);
        throw new Error("Error creating user");
    }
};

export const authenticateUser = async ({ email, password }) => {
    try {
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                password: users.password,
                role: users.role,
                created_at: users.created_at
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        logger.info(`User ${user.email} authenticated successfully`);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        logger.error(`Error authenticating user: ${error}`);
        throw error;
    }
};
