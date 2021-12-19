import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(cors());



app.use(express.json());
app.use(express.urlencoded({extended: true}));


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
    ).then(
        ()=>{ console.log("Database Connected"); },
        err => { console.log(err); }

   )


//Home Page
app.get('/', (req, res)=>{
    res.status(200).send('Welome Home');
});

//Load Routes
import userRouter from "./routes/users.js";
import taskRouter from "./routes/tasks.js";

//Use Routes
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

// app.use( (req, res, next) => {
//     // return res.status(404).send("404 Page")
// });

app.use((err, req, res, next) => {
    
    if(err){
        console.log(err);
        res.status(400).send(err.code);
    }
    
   

});

app.listen(process.env.PORT || 5000); 