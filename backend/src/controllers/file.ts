import db from "../configurations/db"
import { Request, Response } from "express";



//  track files
export const getTrack = async (req: Request, res: Response): Promise<any> => {
    const file_id = req.params.id;
    if (!file_id || isNaN(Number(file_id))) {
        return res.status(400).json({ error: 'Invalid file ID' });
    }

    try {
        const result = await db`SELECT to_users, from_user, remarks, created_at 
                                FROM actions 
                                WHERE file_id = ${file_id} 
                                ORDER BY created_at`;

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No actions found for this file ID' });
        }

        console.log(result); // Optional for debugging

        res.json({
            data: result,
        });
    } catch (error) {
        console.error('Error fetching tracking information for file:', error);
        res.status(500).json({ error: 'Error fetching tracking information for the file' });
    }
};

// get files for logged in user
export const getFiles =async(req:Request,res:Response):Promise<any>=>{

    try{
    if (!(req.session && req.session.user)) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    const User = req.session.user.username;
    const result = await db `SELECT* FROM actions WHERE from_user = ${User}`
    res.json({
        massage: 'files are fetched',
        fileData: result
    });
}catch (error) {
        console.error('Error in fetching files:', error);
        res.status(500).json({ error: 'Error in fetching files' });
    }


};
