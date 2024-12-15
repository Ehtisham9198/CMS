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
        
        const result = await db `INSERT INTO files (id,title,uploaded_by) VALUES ( ${id}, ${title},${uploaded_by})`
        res.json({
            message: 'File initiated successfully',
            fileData: result[0]
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
    const result = await db `SELECT id, title FROM files WHERE uploaded_by = ${User}`
    res.json({
        massage: 'files are fetched',
        fileData: result
    });
}catch (error) {
        console.error('Error in fetching files:', error);
        res.status(500).json({ error: 'Error in fetching files' });
    }


})




app.post('/api/file_actions', async (req, res): Promise<any> => {
    try {
        let from_user;
        if (req.session && req.session.user && req.session.user.username) {
            from_user = req.session.user.username;
        } else {
            return res.status(400).json({ error: 'User not logged in' });
        }

     
        // finding username related to designation in users table
        const { id, to_users, action} = req.body;
        const check = await db `SELECT COUNT(*) AS count FROM files WHERE id = ${id}`
        if(check.length>0){

        const result2 = await db`SELECT username FROM users WHERE designation = ${to_users}`;
        const remarks = "No remarks"

        const result1 = await db`SELECT title FROM files WHERE file_id = ${id}`;
        if (!result1 || !result1.length) {
            return res.status(404).json({ error: 'No files found for the user' });
        }

        const { title } = result1[0] || {};

        if (!result2 || !result2.length) {
            return res.status(404).json({ error: 'No users found with the specified designation' });
        }

        const to_username = result2[0]; // Assuming the first result is the correct one
        console.log(to_username);

        const result = await db`INSERT INTO Actions(from_user, file_id, to_users, action, remarks, title) 
                       VALUES (${from_user}, ${id}, ${to_username.username}, ${action}, ${remarks}, ${title})`;

        res.json({
            message: 'File processed successfully',
            fileData: result || {}
        });
    }else{
        return res.status(401).json({ error: 'Invalid Id' });
    }
    }
    catch (error) {
        console.error('Error in processing file:', error);
        res.status(500).json({ error: 'Error in processing file' });
    }
});

// for fetch recieved files

app.get('/api/recievedFile',async(req,res)=>{
    let received;
    if (req.session && req.session.user && req.session.user.username) {
        received = req.session.user.username;
    }
    const result = await db `SELECT file_id,remarks,from_user,title,action FROM actions WHERE to_users =${received}`
    res.json({
        message: 'File processed successfully',
        fileData: result || {}
    });
})

// track status

app.get('/api/track/:id',async(req,res)=>{
    
    const result = await db `SELECT to_users FROM actions WHERE file_id = ${req.params.id}`
    res.json({
        data:result
    })
})


// for login
app.post('/api/login', async (req, res): Promise<any> => {
    try {
        const { username, password } = req.body;
        const result = await db `SELECT email, password FROM users WHERE username = ${username}`;
 
        const user = result[0];
        if (user?.password && await bcrypt.compare(password, user.password)) {
            if (req.session) {
                req.session.user = { username: username }; 
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
  });


  //Logout
  app.post('/api/logout', (req, res) => {
    if (req.session) {
        req.session = null; 
    }
    res.json({ message: 'Logged out successfully' });
});




async function main() {

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main();