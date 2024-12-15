import { tryCatch } from "../lib/util";

export const getSession = tryCatch((req, res) => {
    res.json({session: req.session});
});


