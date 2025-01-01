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
    const User = req.session.user.designation;
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


export const getInitiateFiles = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id, title, content } = req.body;
    let uploaded_by
    if (req.session && req.session.user) {
      uploaded_by = req.session.user.designation;
    }

    let file = req.file;

    const checkcaseResult = await db`
      SELECT caseid
      FROM files
      WHERE file_id = ${id} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    console.log(checkcaseResult,"checking case");
    let caseNumber = 1;
    let newFileId


    // If there are previous records, increment the case number
    if (checkcaseResult.length > 0) {
      const latestCase = checkcaseResult[0].caseid;
      newFileId = id ? `${id}/${parseInt(latestCase, 10) + 1}` : null;
      caseNumber = parseInt(latestCase, 10) + 1;
    }else{
      newFileId = id+'/1'
    }
    // If no file is uploaded, store data without file field

    if (!file) {
    const result = await db`
        INSERT INTO files (id, title, uploaded_by, content, "caseid",file_id) 
        VALUES (${newFileId}, ${title}, ${uploaded_by}, ${content}, ${caseNumber},${id})`;
      res.status(200).send({ message: 'File record created without upload.' });

    } else {
      const result = await db`
        INSERT INTO files (id, title, uploaded_by, content, file, caseid,file_id) 
        VALUES (${newFileId}, ${title}, ${uploaded_by}, ${content}, ${id}, ${caseNumber},${id})
      `;
      res.status(200).send({ message: 'File record created with upload.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error while initiating the file.', error });
  }
};





export const getReceivedFiles = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let my_designation;
    if (req.session && req.session.user && req.session.user.username) {
      my_designation = req.session.user.designation;
    } else {
      return res.status(400).json({ error: "User not logged in" });
    }

    const actionState = "Pending";

    // Fetch pending files for the current user
    const result = await db`
            SELECT DISTINCT files.id as id,files.title AS title,from_user AS forwarded_by,files.uploaded_by AS uploaded_by,files.created_at AS created_at, actions.action as status
            FROM actions JOIN files ON actions.file_id = files.id
            WHERE actions.to_user = ${my_designation} AND ( actions.action = ${actionState} OR actions.action = 'Completed')
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


export const getTrackedMyFile = async(req:Request,res:Response):Promise<any>=>{
  try{
    let user;
    if(req.session)
    {
      user = req.session.user.designation;
    }

    const myFiles = await db`
      SELECT 
        files.id AS id, 
        files.title AS title, 
        (
          SELECT designation 
          FROM paths 
          WHERE file_id = files.id 
          ORDER BY created_at DESC 
          LIMIT 1 
          OFFSET 1
        ) AS forwarded_by, 
        files.uploaded_by AS uploaded_by, 
        files.created_at AS created_at, 
        actions.action AS status
      FROM 
        files
      JOIN 
        actions ON actions.file_id = files.id
      WHERE 
        actions.id = (
          SELECT MAX(a.id)
          FROM actions a 
          WHERE a.file_id = files.id AND a.from_user = ${user}
        );
    `;

    res.json({
      message : 'fetched successfully',
      fileData : myFiles
    });
  }
  catch(error)
  {
    console.log("Error in fetching file", error)
    res.status(500).json({ error: "Error in fetching file"});
  }
}