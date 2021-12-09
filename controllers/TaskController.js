import Task from "../models/Task.js"

const TaskController = {

    index: async (req, res) => {

        const match = {};
        const sort = {};

        if (req.query.completed){
            match.completed = req.query.completed === "true";
        }

        if (req.query.sortBy){
           const part = req.query.sortBy.split(":"); //converts SortBy value to array
            sort[part[0]] = part[1] === "desc" ? -1 : 1;

        }

        try{
            await req.user.populate({
                path: "tasks",
                match,
                options:{
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate();
            res.status(200).send(req.user.tasks);

        }catch (e) {
            res.status(500).send(e.message);
        }

    },


    store: async (req, res) => {

        const newTask = new Task({
            description: req.body.description,
            owner: req.user._id
        }); 

        await newTask.save().then(()=>{
            res.status(201).send(newTask);
        }).catch((e)=>{
            res.status(400).send(e.message);
        });

    },

    show: async (req, res) => {

        await Task.findOne({_id: req.params.id, owner: req.user._id}).then((task) => {
            if (task){
                return res.status(200).send(task);
            }else{
                res.status(404).send();
            }
        }).catch((e) => {
            res.status(500).send();
        });
    },

    update: async (req, res) => {
        const id = req.params.id;
        const obj = Object.keys(req.body)
        // console.log(obj)

        const task = await Task.findById(id);
        if (task){
            task.description = req.body.description;
            task.completed = req.body.completed;
            await task.save().then(() =>{
                res.status(200).send(task);
            }).catch((e) => {return res.status(404).send(e.message)})
        }
        else {
            res.status(400).send("Error occurred");
        }
    },

    destroy: async (req, res) => {


        Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
            .then(()=>{

                res.status(200).send();
            })
            .catch((e)=>{
                res.status(500).send(e.message);
            });
    

    }

}

export default TaskController;