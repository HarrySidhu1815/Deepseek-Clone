import mongoose from "mongoose";

const userSchemea = new mongoose.Schema({
    _id : {type: String, required: true},
    name : {type: String, required: true},
    email_address : {type: String, required: true},
    image_url : {type: String, required: false}
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model('User', userSchemea)

export default User