import "dotenv/config"
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import fileRouter from "./routes/files";
import session from "cookie-session";
import userRouter from "./routes/user";
import path from "path";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    credentials:true,
    origin:"https://flowx2.vercel.app/"
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
app.use("/api", fileRouter);
app.use("/api", userRouter);


app.get('/attachments/:id', (req, res) => {
    res.sendFile(path.join(process.cwd(), "uploads", req.params.id));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), "..", "frontend", "dist", "index.html"));
});


async function main() {
  // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main();