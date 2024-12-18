import bcrypt from 'bcrypt';
import db from "../configurations/db";
import { tryCatch } from "../lib/util";

const SALT_ROUNDS = 10;

// For creating user
export const createUser = tryCatch(async (req, res) => {
    const { username, name, email, password, designation } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if(!username || !password) {
        return res.status(400).json({
            success: false,
            error: "missing required feilds"
        });
    }

    const result = await db`
        INSERT INTO users (username, name, email, password, designation)
        VALUES (${username}, ${name}, ${email}, ${hashedPassword}, ${designation})
        RETURNING *
    `;

    res.json({
        success: true,
        message: 'user added successfully',
        fileData: result[0]
    });
});


//   change pass
export const changedPassward = tryCatch(async (req, res) => {
    const { username, password, newpassword } = req.body;

    if(!username || !password || !newpassword) {
        return res.status(400).json({
            success: false,
            error: "missing required feilds"
        });
    }

    const [user] = await db`SELECT password FROM users WHERE username = ${username}`;

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Invalid username or current password'
        });
    }

    const hashedNewPassword = await bcrypt.hash(newpassword, SALT_ROUNDS);
    await db`UPDATE users SET password = ${hashedNewPassword} WHERE username = ${username}`;

    res.json({
        success: true,
        message: 'Password changed successfully',
    });
});


export const getAllDesignations = tryCatch(async (req, res) => {
    const designations = await db`SELECT DISTINCT designation FROM users`;

    res.json({
        success: true,
        data: designations,
    });
});
