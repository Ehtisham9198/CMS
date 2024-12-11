import "dotenv/config"
import express from "express";
import cors from "cors";
import db from "./configurations/db";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


// For creating user
app.post("/api/CreateUser", async(req,res)=>{
    try {
        const {name,password, email} = req.body;
        const query = 'INSERT INTO users(name,password,email) VALUES($1,$2,$3) RETURNING*'
        const values = [name,password,email]
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
app.post('/api/login',async(req,res)=>{
    try{
    const {email,password} = req.body;
    const query = `SELECT email FROM users where email=$1 and password= $2`
    const values = [email,password];
    const result = await db.query(query,values);
    if(result)
    {
        console.log("Welcome")
    }else{
        console.log("Credential error")
    }
}catch(error)
{
    console.log(error);
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