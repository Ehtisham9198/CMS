import db from "../configurations/db";
import { Request, Response } from "express";



//  track files
export const getTrack = async (req: Request, res: Response): Promise<any> => {
  const file_id = req.params.id;
  if (!file_id) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const result =
      await db`SELECT id, to_user as to_user, from_user, remarks, created_at 
                                FROM actions 
                                WHERE file_id = ${file_id} 
                                ORDER BY created_at`;

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No actions found for this file ID" });
    }

    res.json({
      data: result,
    });
  } catch (error) {
    console.error("Error fetching tracking information for file:", error);
    res
      .status(500)
      .json({ error: "Error fetching tracking information for the file" });
  }
};




// get files for logged in user
export const getFiles = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!(req.session && req.session.user)) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const User = req.session.user.username;
    const result = await db`
    SELECT f.id, f.title, f.content, f.created_at
    FROM files f
    LEFT JOIN actions a ON f.id = a.file_id
    WHERE f.uploaded_by = ${User} AND a.file_id IS NULL;
  `;

    res.json({
      massage: "files are fetched",
      fileData: result,
    });
  } catch (error) {
    console.error("Error in fetching files:", error);
    res.status(500).json({ error: "Error in fetching files" });
  }
};




// get file by id
export const getFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const file_id = req.params.id as string;
    const [file] = await db`SELECT* FROM files WHERE id = ${file_id}`;

    if(!file){
      return res.status(404).json({
        success: false,
        error: "file not found.",
      });
    }

    res.json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error("Error in fetching files:", error);
    res.status(500).json({ error: "Error in fetching files" });
  }
};


// for initiate new file
export const getInitiateFiles = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id, title,content} = req.body;
    let uploaded_by;
    if (req.session && req.session.user) {
      uploaded_by = req.session.user.username;
    }
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }
    const filePath =file.path;
    const result = await db`
      INSERT INTO files (id, title, uploaded_by, content, file) 
      VALUES (${id}, ${title}, ${uploaded_by}, ${content}, ${filePath})
    `;

    res.json({
      message: "File initiated successfully",
      fileData: result[0],
    });
  } catch (error) {
    console.error("Error initiating file:", error);
    res.status(500).json({ error: "Error initiating file" });
  }
};




export const getReceivedFiles = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let my_username;
    if (req.session && req.session.user && req.session.user.username) {
      my_username = req.session.user.username;
    } else {
      return res.status(400).json({ error: "User not logged in" });
    }

    const actionState = "Pending";

    // Fetch pending files for the current user
    const result = await db`
            SELECT DISTINCT files.id as id,files.title AS title,from_user AS forwarded_by,files.uploaded_by AS uploaded_by,files.created_at AS created_at, actions.action as status
            FROM actions JOIN files ON actions.file_id = files.id
            WHERE actions.to_user = ${my_username} AND ( actions.action = ${actionState} OR actions.action = 'Completed')
        `;

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "No pending files found for the user",
        fileData: [],
      });
    }

    res.status(200).json({
      message: "Files fetched successfully",
      fileData: result,
    });
  } catch (error) {
    console.error("Error fetching received files:", error);
    res.status(500).json({ error: "Error fetching received files" });
  }
};




export const getEditFile =async(req:Request,res:Response): Promise<any>=>{
try{
 const {id,title,content} = req.body
 if (!id || !title || !content) {
  return res.status(400).json({ error: "All fields are required" });
}
 console.log(req.body)
 await db `UPDATE files SET title = ${title},content= ${content} WHERE id=${id}`
 res.status(200).json({
    message: "Editted successfully",
})
}catch(error)
{
    res.status(500).json({error: 'Error in Editing'})
}
}





export const getfileById = async (req: Request, res: Response):Promise<any> => {

    try {
      const fileId = req.query.file_id as string;
      if (!(req.session && req.session.user)) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      const User = req.session.user.username;

      if (!fileId) {
        return res.status(400).json({ error: "File ID is required" });
      }
      
      const result = await db`
      SELECT id, title, content, created_at
      FROM files 
      WHERE uploaded_by = ${User} AND id = ${fileId}`;
      
  
      res.json({
        massage: "file is fetched",
        fileData: result,
      });
    } catch (error) {
      console.error("Error in fetching files:", error);
      res.status(500).json({ error: "Error in fetching files" }); 
    }
};