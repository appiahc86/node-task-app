import mongoose from "mongoose";
const {Schema} = mongoose;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Task from "./Task.js";

const UserSchema = new Schema({

   name: {
       type: String,
       required: true
   },

   email: {
       type: String,
       required: true,
       unique: true,
       lowercase: true
   },

    password: {
       type: String
    },

    tokens: [{
       token: {
           type: String,
           required: true
       }
    }]


}, {timestamps: true});


//filter user records when login or register
UserSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.tokens;
    delete userObject.password;

    return userObject;
}

//Generate Json web token and store in the database
UserSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

//Find user and compare password
UserSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({email: email});
    if (!user){
        throw new Error("User not found");
    }

    const isMatched = await bcrypt.compareSync(password, user.password);
    if (!isMatched){
        throw new Error("password does not match");
    }else {
        return user;
    }
}

//Hash plain password
UserSchema.pre('save', async function (next) {

    if (this.isModified('password')){
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hashSync(this.password, salt);
    }

    next()
});

//User Tasks relationship
UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Delete Tasks along with user
UserSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});

    next();
})

const User = mongoose.model('User', UserSchema);

export default User;
