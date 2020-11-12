import express from "express";
import path from "path";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";


//ENV
dotenv.config();

//DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},
    ()=>{
        console.log("Database Connected");
    }
    );



const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(morgan());

//Load Routes
import userRouter from "./routes/users.js";
import taskRouter from "./routes/tasks.js";

//Use Routes
app.use('/users', userRouter);
app.use('/tasks', taskRouter);



app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});