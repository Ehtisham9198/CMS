import db from "../configurations/db"
import { Request, Response } from "express";



//  track files
export const getTrack = async (req: Request, res: Response): Promise<any> => {
    const file_id = req.params.id;
    if (!file_id || isNaN(Number(file_id))) {
        return res.status(400).json({ error: 'Invalid file ID' });
    }

    try {
        const result = await db`SELECT id, to_users as to_user, from_user, remarks, created_at 
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
export const getFiles = async (req: Request, res: Response): Promise<any> => {

    try{
    if (!(req.session && req.session.user)) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    const User = req.session.user.username;
    const result = await db`
    SELECT f.id, f.title 
    FROM files f
    LEFT JOIN actions a ON f.id = a.file_id
    WHERE f.uploaded_by = ${User} AND a.file_id IS NULL;
  `;
  
  
    res.json({
        massage: 'files are fetched',
        fileData: result
    });
}catch (error) {
        console.error('Error in fetching files:', error);
        res.status(500).json({ error: 'Error in fetching files' });
    }


};

// get file by id
export const getFile = async (req: Request, res: Response): Promise<any> => {
    try {
        const file_id = req.params.id as string;
        const result = await db`SELECT* FROM files WHERE id = ${file_id}`
        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Error in fetching files:', error);
        res.status(500).json({ error: 'Error in fetching files' });
    }
};



// for fetch recieved files
export const getRecievedFiles = async (req: Request, res: Response) => {
    let received;
    if (req.session && req.session.user && req.session.user.username) {
        received = req.session.user.username;
    }
    const result = await db`SELECT id,uploaded_by,title,created_at FROM files WHERE uploaded_by =${received}`
    res.json({
        message: 'File processed successfully',
        fileData: result || {}
    });
}


// Get actions
export const getActions = async (req: Request, res: Response): Promise<any> => {
    try {
        let from_user;
        if (req.session && req.session.user && req.session.user.username) {
            from_user = req.session.user.username;
        } else {
            return res.status(400).json({ error: 'User not logged in' });
        }

        const { file_id: id, action, to_users: to_designation, } = req.body;
        console.log(req.body)

        // Validate that all necessary fields are provided
        if (!id || !to_designation || !action) {
            return res.status(400).json({ error: 'Missing required fields' });
        }


        // Check if file exists
        const check = await db`SELECT COUNT(*) AS count FROM files WHERE id = ${id}`;
        if (!check || !check.length || check[0].count === 0) {
            return res.status(404).json({ error: 'No files found for this id' });
        }

        // Fetch the username of the user with the specified designation
        const result2 = await db`SELECT username FROM users WHERE designation = ${to_designation}`;
        if (!result2 || !result2.length) {
            return res.status(404).json({ error: 'No users found with the specified designation' });
        }
        
        const to_username = result2[0]; // Assuming the first result is valid
        console.log(to_username);

        if(to_username.username===from_user)
        {
            return res.status(404).json({ error: 'You can not send files to yourselves' });
        }

        // Fetch file title
        const result1 = await db`SELECT title FROM files WHERE id = ${id}`;
        if (!result1 || !result1.length) {
            return res.status(404).json({ error: 'No files found for the user' });
        }

        const { title } = result1[0]; // Assuming the first result contains the title

        // Check if both to_username and title are defined
        if (!to_username.username || !title) {
            return res.status(400).json({ error: 'Invalid data found for the file' });
        }

        // Insert action into the database
        const remarks = "No remarks";
        const result = await db`INSERT INTO Actions(from_user, file_id, to_users, action, remarks, title) 
                                VALUES (${from_user}, ${id}, ${to_username.username}, ${action}, ${remarks}, ${title})`;

        res.status(200).json({
            message: 'File processed successfully',
            fileData: result || {}
        });
    } catch (error) {
        console.error('Error in processing file:', error);
        res.status(500).json({ error: 'Error in processing file' });
    }
};


// for initiate new file
export const getInitiatedFiles = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, title } = req.body;
        console.log(req.body)
        let uploaded_by
        if (req.session && req.session.user) {
            uploaded_by = req.session.user.username;
        }

        const result = await db`INSERT INTO files (id,title,uploaded_by) VALUES ( ${id}, ${title},${uploaded_by})`

        res.json({
            message: 'File initiated successfully',
            fileData: result[0]
        });
    }
    catch (error) {
        console.error('Error initiating file:', error);
        res.status(500).json({ error: 'Error initiating file' });
    }
}