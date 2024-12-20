import db from "../configurations/db";
import { Request, Response } from "express";




export const getActions = async (req: Request, res: Response): Promise<any> => {
    try {
      let from_user;
      if (req.session && req.session.user && req.session.user.username) {
        from_user = req.session.user.designation;
      } else {
        return res.status(400).json({ error: "User not logged in" });
      }
  
      let { file_id: id, action,remarks, to_user: to_designation} = req.body;
  
      if (!id || !action) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Check if file exists
      const check =
        await db`SELECT COUNT(*) AS count FROM files WHERE id = ${id}`;
      if (!check || !check.length || check[0].count === 0) {
        return res.status(404).json({ error: "No files found for this id" });
      }
  
  
      // If the action is "forward," update the previous entry and create a new one
      if (action === "forward") {
        // Fetching the username of the user with the specified designation
        if (to_designation === from_user) {
          return res
            .status(400)
            .json({ error: "You cannot send files to yourself" });
        }

        console.log(to_designation,"designation of receiver")
        console.log(from_user,"designation of sender")
  
        // Update the previous action to "Forwarded"
        await db`UPDATE actions 
                  SET action = 'Forwarded' 
                  WHERE  to_user = ${from_user} AND created_at = (SELECT MAX(created_at)FROM actions WHERE file_id = ${id})`;
  
        // Update the previous action to "Forwarded"
        await db`INSERT INTO paths(designation,file_id) VALUES (${to_designation},${id})`;
  
        // Insert the new "Pending" action for the receiving user
        const result =
          await db`INSERT INTO actions(from_user, file_id, to_user, action, remarks) 
                                      VALUES (${from_user}, ${id}, ${to_designation}, 'Pending', ${remarks})`;
  
        return res.status(200).json({
          message: "File forwarded successfully",
          fileData: result || {},
        });
      }
      if (action === "reject") {

        let previousUser = (await db`
              SELECT designation
              FROM paths
              WHERE file_id = ${id}
              ORDER BY created_at DESC
              OFFSET 1
              LIMIT 1`)[0]?.designation;
  
        await db`DELETE FROM paths
              WHERE file_id = ${id}
              AND created_at = (
              SELECT MAX(created_at)
              FROM paths
              WHERE file_id = ${id})`;
  
        if (!previousUser || previousUser.length === 0) {
          previousUser = (await db`
              SELECT uploaded_by
              FROM files
              WHERE id = ${id}`)[0]?.uploaded_by;
        }
  
        if (previousUser === from_user) {
          return res
            .status(400)
            .json({ error: "You cannot send files to yourself" });
        }
  
        // Update the previous action to "Forwarded"
        await db`UPDATE actions 
                       SET action = 'Rejected' 
                       WHERE  to_user = ${from_user} AND created_at = (SELECT MAX(created_at)FROM actions WHERE file_id = ${id})`;
  
        // Insert the new "Pending" action for the receiving user
        const result =
          await db`INSERT INTO actions(from_user, file_id, to_user, action, remarks) 
                                      VALUES (${from_user}, ${id}, ${previousUser}, 'Pending', ${remarks}
                                      )`;
  
        return res.status(200).json({
          message: "File forwarded successfully",
          fileData: result || {},
        });
      }
  
  
      // Completion action
  
      if (action === "complete") {
        let previousUser = (await db`
              SELECT designation
              FROM paths
              WHERE file_id = ${id}
              ORDER BY created_at DESC
              OFFSET 1
              LIMIT 1`)[0]?.designation;
  
        await db`DELETE FROM paths
              WHERE file_id = ${id}
              AND created_at = (
              SELECT MAX(created_at)
              FROM paths
              WHERE file_id = ${id})`;
  
        if (!previousUser || previousUser.length === 0) {
          previousUser = (await db`
              SELECT uploaded_by
              FROM files
              WHERE id = ${id}`)[0]?.uploaded_by;
        }
  
        if (previousUser === from_user) {
          return res
            .status(400)
            .json({ error: "You cannot send files to yourself" });
        }
  
        // Update the previous action to "Forwarded"
        await db`UPDATE actions 
                       SET action = 'Completed' 
                       WHERE  to_user = ${from_user} AND created_at = (SELECT MAX(created_at)FROM actions WHERE file_id = ${id})`;
  
        // Insert the new "Pending" action for the receiving user
        const result =
          await db`INSERT INTO actions(from_user, file_id, to_user, action, remarks) 
                                      VALUES (${from_user}, ${id}, ${previousUser}, 'Completed', ${remarks})`;
  
        return res.status(200).json({
          message: "File Processed successfully",
          fileData: result || {},
        });
      }
  
  
  
  
      // Initial "Send" action
      if (action === "Send") {
        action = "Pending";
      }

      if (to_designation === from_user) {
        return res
          .status(400)
          .json({ error: "You cannot send files to yourself" });
      }
  

      const result =
        await db`INSERT INTO actions(from_user, file_id, to_user, action, remarks) 
                                  VALUES (${from_user}, ${id}, ${to_designation}, ${action}, ${remarks})`; 
  
        await db`INSERT INTO paths(designation, file_id) VALUES (${to_designation}, ${id})`

  
      res.status(200).json({
        message: "File processed successfully",
        fileData: result || {},
      });
    } catch (error) {
      console.error("Error in processing file:", error);
      res.status(500).json({ error: "Error in processing file" });
    }
  };
  
  