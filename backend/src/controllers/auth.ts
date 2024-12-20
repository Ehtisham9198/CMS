import { Request, Response } from "express";
import { tryCatch } from "../lib/util";
import bcrypt from 'bcrypt';
import db from "../configurations/db";

// for login
export const login = tryCatch(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
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

    const designation = await db`SELECT designations.designation_name FROM designations INNER JOIN dtu ON designations.id = dtu.id WHERE dtu.username = ${username}`;
    console.log(designation)


    if (req.session) {
        req.session.user = { username: username, designation: designation[0].designation_name };
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

export const changeDesignation = tryCatch(async (req, res) => {
    const designation = req.body.designation;
    // console.log(req.body, req.session);

    if (!designation) {
        res.status(400).json({
            success: false,
            error: "designation not provided",
        });
    }

    const designations = await db`
        SELECT DISTINCT designation_name
        FROM designations JOIN dtu
        ON designations.id = dtu.id
        WHERE dtu.username = ${req.session?.user.username} AND designations.designation_name = ${designation};` as any[];

    if (designations.length <= 0) {
        res.status(404).json({
            success: false,
            error: "designation not found",
        });
    }

    if (req.session) {
        req.session.user.designation = designation;
    }

    res.json({ success: true });
});
