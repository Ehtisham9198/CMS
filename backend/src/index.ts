import "dotenv/config"
import express from "express";
import cors from "cors";
import db from "./configurations/db";
import bcrypt from 'bcrypt';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


// For creating user
app.post("/api/CreateUser", async(req,res)=>{
    try {
        const {username,name,email,password} = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const query = 'INSERT INTO users(username, name,email,password) VALUES($1,$2,$3,$4) RETURNING*'
        const values = [username,name,email,hashedPassword]
        const result = await db.query(query,values);
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
app.post('/api/initiate_file',async(req,res)=>{
    try{
    const {title,uploaded_by,file_path,} = req.body;
    const query = 'INSERT INTO files(title,uploaded_by,file_path) VALUES ($1,$2,$3)'
    const values = [title,uploaded_by,file_path]
    const result = await db.query(query,values);
    res.json({
        message: 'File initiated successfully',
        fileData: result.rows[0]
    });
    }
    catch(error)
    {
        console.error('Error initiating file:', error);
        res.status(500).json({ error: 'Error initiating file' });
    }
})

//  for file movement
app.post('/api/file_actions',async(req,res)=>{
    try{
    const {file_id,from_user,to_user,action,remarks} = req.body;
    const query = `INSERT INTO Actions(file_id,from_user,to_user,action,remarks) VALUES ($1,$2,$3,$4,$5)`
    const values = [file_id,from_user,to_user,action,remarks]
    const result = await db.query(query,values);
    res.json({
        message: 'File processed successfully',
        fileData: result.rows[0]
    });
    }
    catch(error)
    {
        console.error('Error in processing file:', error);
        res.status(500).json({ error: 'Error in processing file' });
    }

})


// for login
app.post('/api/login',async(req,res):Promise<any>=>{
    try{
    const {username,password} = req.body;
    const query = `SELECT email, password FROM users WHERE username = $1`;
    const values = [username];
    const result = await db.query(query, values);
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password,user.password)
    if(result.rows[0] && isMatch){
    // Successful login
    res.json({
        message: 'Logged in successfully',
        user: { email: result.rows[0].email },
        });
        console.log( result.rows[0].email )
        
    }else{
        return res.status(401).json({ error: 'Invalid username or password' });
        
    }
   
     }catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.post('/api/ChangePassword',async(req,res):Promise<any>=>{
    try{
    const {username,password,newpassword} = req.body;
    const query = `SELECT password FROM users where username = $1`
    const values = [username];
    const result = await db.query(query,values);
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password,user.password);
    if(isMatch)
    {
        const query1 =`UPDATE users SET password = $1 WHERE username = $2`
        const values1 = [newpassword,username];
        const result2 = await db.query(query1,values1)
        console.log("Password changes successfully!")
        res.json({
            message:"Passowrd changed successfully"
        })
    }else{
        return res.status(401).json({ error: 'Invalid username or password' });
        
    }
    }catch(error) {
            console.error('Error in password changes:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

})


async function main() {
    await db.connect();

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main();