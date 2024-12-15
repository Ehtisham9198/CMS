import "dotenv/config"
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import fileRouter from "./routes/file";
import session from "cookie-session";
import userRouter from "./routes/user"

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
app.use("/api", fileRouter);
app.use("/api", userRouter);



async function main() {
  // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main();