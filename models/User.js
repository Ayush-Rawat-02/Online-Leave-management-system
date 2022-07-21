const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema({
    user_type:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true
    },
    department:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type : Date,
        default : Date.now
    },
    leaves: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Leave"
        }
      ]
});

const User = mongoose.model('User',UserSchema);
module.exports = User;