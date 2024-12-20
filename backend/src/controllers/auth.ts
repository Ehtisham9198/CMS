import { Request, Response } from "express";
import { tryCatch } from "../lib/util";
import bcrypt from 'bcrypt';
import db from "../configurations/db";

// for login
export const login = tryCatch(async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({
            success: false,
            error: "missing required feilds"
        });
    }

    const [user] = await db`SELECT email, password FROM users WHERE username = ${username}`;

    if (!user?.password || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({
            success: false,
            error: 'Invalid username or password'
        });
    }

    if (req.session) {
        req.session.user = { username: username, designation: user.designation };
    }

    return res.json({
        message: 'Logged in successfully',
        user: { email: user.email },
    });
});


//Logout
export const logout = (req: Request, res: Response) => {
    req.session = null;
    res.json({ message: 'Logged out successfully' });
};


export const getSession = tryCatch((req, res) => {
    res.json({ session: req.session });
});
