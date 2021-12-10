import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
// app.use(cors());
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// app.use(morgan());
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
    ()=>{
        console.log("Database Connected");
    }
    );

// const port = process.env.port || 3000;

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

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

app.use( (req, res, next) => {
    // return res.status(404).send("404 Page")
});

app.use((err, req, res, next) => {
    
    if(err){
        console.log(err);
        res.status(400).send(err.code);
    }
    
   

});

app.listen(process.env.PORT || 5000);