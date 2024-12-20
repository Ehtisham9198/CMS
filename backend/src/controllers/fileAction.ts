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
              LIMIT 1`)[0]?.username;
  
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
              LIMIT 1`)[0]?.username;
  
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
  
      // Fetching the username of the user with the specified designation
      const result2 =
        await db`SELECT dtu.username FROM dtu INNER JOIN designations ON designations.id = dtu.id WHERE designations.designation_name  = ${to_designation}`;
      if (!result2 || !result2.length) {
        return res
          .status(404)
          .json({ error: "No users found with the specified designation" });
      }
  
      const to_username = result2[0];
      if (to_username.username === from_user) {
        return res
          .status(400)
          .json({ error: "You cannot send files to yourself" });
      }
  
      // Check if both to_username and title are defined
      if (!to_username.username ) {
        return res.status(400).json({ error: "Invalid data found for the file" });
      }
  
      const result =
        await db`INSERT INTO actions(from_user, file_id, to_user, action, remarks) 
                                  VALUES (${from_user}, ${id}, ${to_username.username}, ${action}, ${remarks})`;

      const designation = await db `SELECT designations.designation_name FROM designations INNER JOIN dtu ON designations.id = dtu.id WHERE dtu.username = ${to_username.username}`;
      console.log(designation)
  
      await db`INSERT INTO paths(designation, file_id) VALUES (${designation[0].designation_name}, ${id})`

  
      res.status(200).json({
        message: "File processed successfully",
        fileData: result || {},
      });
    } catch (error) {
      console.error("Error in processing file:", error);
      res.status(500).json({ error: "Error in processing file" });
    }
  };
  
  