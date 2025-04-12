import mongoose from "mongoose";

const userSchemea = new mongoose.Schema({
    _id : {type: String, require: true},
    name : {type: String, require: true},
    email_address : {type: String, require: true},
    image_url : {type: String, require: false}
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model('User', userSchemea)

export default User