import { Request, Response } from "express";
import { tryCatch } from "../lib/util";
import bcrypt from 'bcrypt';
import db from "../configurations/db";
import session from "cookie-session";

export const getSession = tryCatch((req, res) => {
    res.json({session: req.session});
});


// For creating user
export const getCreateUser=async (req:Request, res:Response) => {
    try {
        const { username, name, email, password,designation } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await db`
        INSERT INTO users (username, name, email, password, designation)
        VALUES (${username}, ${name}, ${email}, ${hashedPassword}, ${designation})
        RETURNING *`;
        res.json({
            message: 'user added successfully',
            fileData: result[0]
        });
    } catch (error) {
        console.error('Error in creating a user:', error);
        res.status(500).json({ error: 'Error in creating user' });
    }
}


// for login
export const getLogin= async (req:Request, res:Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const result = await db `SELECT email,designation,name, password FROM users WHERE username = ${username}`;
        
 
        const user = result[0];
        if (user?.password && await bcrypt.compare(password, user.password)) {
            if (req.session) {
                req.session.user = { username: username, designation:result[0].designation,name:result[0].name }; 
            }
            return res.json({
                message: 'Logged in successfully',
                user: { email: user.email },
            });
        } else {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



//   change pass
export const getChangedPassward= async (req:Request, res:Response): Promise<any> => {
    try {
      const { username, password, newpassword } = req.body;
      const result = await db `SELECT password FROM users WHERE username = ${username}`;
  
      if (!result[0]) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or current password' });
      }
  
      const hashedNewPassword = await bcrypt.hash(newpassword, 10);
      const updateQuery = `UPDATE users SET password = ${hashedNewPassword} WHERE username = ${username}`;
      res.json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Error in password change:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



  
  //Logout
export const getLogout= (req:Request, res:Response) => {
    if (req.session) {
        req.session = null; 
    }
    res.json({ message: 'Logged out successfully' });
};



// check if the user is logged in
export const getCheckedSession = (req:Request<{}, any, any, Record<string, any>>, res:Response) => {
    console.log(req.session); 
    if (req.session && req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.status(401).json({ loggedIn: false });
    }
};

