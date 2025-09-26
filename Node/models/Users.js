import mongoose from 'mongoose'



const UserSchema = new mongoose.Schema({
    name: {type: String,},
    username: {type: String, required: true},
    password: {type: Number, required: true},
    session: {type:String },
    channel:{type: String, default: ""}
})


export default mongoose.model('user', UserSchema, 'user');


