import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    message:{type: String, required: true},
    group:{type:String ,required: true},
    sender:{type: String, required: true},
    reciever:{type: String, required: true},
    created_at: {type: Date,  default: Date.now()},
    user_id:{type: String, required: true}

})

export default mongoose.model('message', messageSchema, 'message')