import { tryCatch } from "../lib/util";
import db from "../configurations/db"
import { Request, Response } from "express";

export const getSession = tryCatch((req, res) => {
    res.json({session: req.session});
});


