import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();

// app.use(morgan());
app.use(express.json());

//ENV
dotenv.config();

//DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
    ()=>{
        console.log("Database Connected");
    }
    );

const port = process.env.port || 3000;

//Load Routes
import userRouter from "./routes/users.js";
import taskRouter from "./routes/tasks.js";

//Use Routes
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.use( (req, res, next) => {
    return res.status(404).send("404 Page")
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});