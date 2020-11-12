import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema({

    description:{
        type: String,
        required: false
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    completed:{
        type: Boolean,
        default: false
    }

}, {timestamps: true});


export default mongoose.model('Task', taskSchema);