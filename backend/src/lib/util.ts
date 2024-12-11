import { Request, Response } from "express";

type fn = (req: Request, res: Response) => Promise<any> | any;

export function tryCatch(cb: fn): fn {
    return async function (req: Request, res: Response) {
        try {
            await cb(req, res);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({success: false, error: error.message || "internal server error"});
        }
    }
}
