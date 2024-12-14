import "dotenv/config"
import express from "express";
import cors from "cors";
import db from "./configurations/db";
import bcrypt from 'bcrypt';
import session from "cookie-session";
import authRouter from "./routes/auth";


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}));

//adding cookies
app.use(session({
    name: 'session',
    keys: ['very_secret_key'],
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true,
    secure: false,  
    sameSite: 'strict', 
}));



// Routes
app.use("/api/auth", authRouter);


// check if the user is logged in
app.get('/api/checksession', (req, res) => {
    console.log(req.session); 
    if (req.session && req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.status(401).json({ loggedIn: false });
    }
});

// For creating user
app.post("/api/CreateUser", async (req, res) => {
    try {
        const { username, name, email, password,designation } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = 'INSERT INTO users(username, name,email,password,designation) VALUES($1,$2,$3,$4,$5) RETURNING*'
        const values = [username, name, email, hashedPassword,designation]
        const result = await db.query(query, values);
        res.json({
            message: 'user added successfully',
            fileData: result.rows[0]
        });
    } catch (error) {
        console.error('Error in creating a user:', error);
        res.status(500).json({ error: 'Error in creating user' });
    }
})



// for initiate new file
app.post('/api/initiate_file', async (req, res): Promise<any> => {
    try {
        const {id,title} = req.body;
        let uploaded_by
        if (req.session && req.session.user) 
            {
                uploaded_by = req.session.user.username;
            }
        
        const query = 'INSERT INTO files(id,title,uploaded_by) VALUES ($1,$2,$3)'
        const values = [id,title, uploaded_by]
        const result = await db.query(query, values);
        res.json({
            message: 'File initiated successfully',
            fileData: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error initiating file:', error);
        res.status(500).json({ error: 'Error initiating file' });
    }
})
// get files for logged in user
app.get('/api/get_files',async(req,res):Promise<any>=>{

    try{
    if (!(req.session && req.session.user)) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    const User = req.session.user.username;
    const query = `SELECT id, title FROM files WHERE uploaded_by = $1`
    const values = [User]
    const result = await db.query(query,values);
    console.log(result)
    res.json({
        massage: 'files are fetched',
        fileData: result.rows
    });
}catch (error) {
        console.error('Error in fetching files:', error);
        res.status(500).json({ error: 'Error in fetching files' });
    }


})




//  for file movement
app.post('/api/file_actions', async (req, res):Promise<any> => {
    try {
        let from_user;
        if(req.session && req.session.user && req.session.user.username) {
            from_user = req.session.user.username;
        } else {
            return res.status(400).json({ error: 'User not logged in' });
        }

        const query1 = `SELECT id, title FROM files WHERE uploaded_by = $1`;
        const values1 = [from_user];
        const result1 = await db.query(query1, values1);

        if (!result1.rows || !result1.rows.length) {
            return res.status(404).json({ error: 'No files found for the user' });
        }

        const { id, title } = result1.rows[0] || {};

        // finding username related to desgnation in users table
        const { to_users, action, remarks } = req.body;
        console.log(req.body)

        const query2 = `SELECT username FROM users WHERE designation = $1`
        const values2 = [to_users]

        const result2 = await db.query(query2,values2)
        const to_username = result2.rows[0]
        console.log(to_username,"lund");


        const query = `INSERT INTO Actions(from_user, file_id, to_users, action, remarks, title) 
                       VALUES ($1, $2, $3, $4, $5, $6)`;
        const values = [from_user, id, to_username.username, action, remarks, title];
        const result = await db.query(query, values);

        res.json({
            message: 'File processed successfully',
            fileData: result.rows[0] || {}
        });
    }
    catch (error) {
        console.error('Error in processing file:', error);
        res.status(500).json({ error: 'Error in processing file' });
    }
})


// for login
app.post('/api/login', async (req, res): Promise<any> => {
    try {
        const { username, password } = req.body;
        const query = `SELECT email, password FROM users WHERE username = $1`;
        const values = [username];
        const result = await db.query(query, values);
        const user = result.rows[0];
        if (user?.password && await bcrypt.compare(password, user.password)) {
            if (req.session) {
                req.session.user = { username: username }; 
                console.log("Session set:", req.session.user);
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
});




//   change pass
  app.post('/api/ChangePassword', async (req, res): Promise<any> => {
    try {
      const { username, password, newpassword } = req.body;
      const query = `SELECT password FROM users WHERE username = $1`;
      const values = [username];
      const result = await db.query(query, values);
  
      if (!result.rows[0]) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or current password' });
      }
  
      const hashedNewPassword = await bcrypt.hash(newpassword, 10);
      const updateQuery = `UPDATE users SET password = $1 WHERE username = $2`;
      const updateValues = [hashedNewPassword, username];
      await db.query(updateQuery, updateValues);
      res.json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Error in password change:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  //Logout
  app.post('/api/logout', (req, res) => {
    if (req.session) {
        req.session = null; 
    }
    res.json({ message: 'Logged out successfully' });
});




async function main() {
    await db.connect();

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main();