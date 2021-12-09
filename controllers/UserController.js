import User from "../models/User.js";

const UserController = {

    index: async (req, res)=>{

        res.send(req.user);

    },

    //Register User
    store: async (req ,res)=>{

        let {name, email, password} = req.body;


       const newUser = new User({
            name,
            email,
            password
        });

        try {

            const checkEmail = await User.findOne({email: email});
            if (checkEmail){
               throw new Error('User already exists')
            }
            const user = await newUser.save();
            // const token = await user.generateAuthToken(); 
            return  res.status(201).send({user});

        }catch (e) {
            return  res.status(400).send(e.message);
        }


},

    //Uploads profile image
    uploadProfileImage: async (req, res) => {
        req.user.avatar = req.file.buffer;
        await req.user.save();
        res.send();
    },

    //Remove profile picture
    removeProfileImage: async (req, res) => {
        req.user.avatar = undefined;
        await req.user.save();
        res.send("Profile Picture removed");
    },

    //Get profile picture
    getProfilePicture: async (req, res) => {
        try{
            const user = await User.findById(req.params.id);
            if (!user || !user.avatar){
                throw new Error();
            }
                res.set("Content-Type", "image/jpg");
                res.send(user.avatar);

        }catch (e) {
            res.status(404).send();
        }
    },


    //Login User
    login: async (req, res) => {

        try {
           
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token = await user.generateAuthToken();
            res.status(200).send({user, token});
        }catch (e) {
            res.status(400).send(e.message);
        }
 
    },

    //Logout User
    logout: async (req, res) => {
     

        try {
            //Remove the current token from the user's tokens array
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token;
            })
            await req.user.save();
            res.status(200).send("success");
        }catch (e) {
            res.status(500).send(e.message);
        }
    },

    //Logout User from all sessions
    logoutAll: async (req, res) => {
        try {
            req.user.tokens = []; //Clear all user tokens
            await req.user.save();
            res.send("Logged out from all sessions")
        }catch (e) {
            res.status(500).send();
        }
    },


    //Show single User
    show: async (req, res) => {

        User.findById(req.params.id).then((user) => {
            if (user){
                res.status(200).send(user);
            }else return res.status(404).send();

        }).catch((e) => {
            res.status(500).send();
        });
    },

    //Update User
    update: async (req, res) =>{

        const updates = Object.keys(req.body);
        const allowUpdates = ["name", "email", "password"];
        const isValidOperation = updates.every(update => allowUpdates.includes(update));

        if (!isValidOperation){
            return res.status(400).send("bad request");
        }

     const user = req.user;

        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save().then(() => {
            res.status(201).send(user);
        }).catch((e) => {
           res.status(400).send(e)
        });


    },

    //Delete User
    destroy: async (req, res) => {
        try {
            const user = await req.user.remove();
            res.send("Account Deleted Successfully");

        }catch (e) {
            res.status(500).send();
        }
    }


} // ./UserController



export default UserController;