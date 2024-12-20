import { NextFunction, Request, Response } from "express";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if(req.session?.user?.username && req.session?.user?.designation) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized access' });
    }
}
