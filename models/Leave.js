const mongoose=require('mongoose');

var LeaveSchema = new mongoose.Schema(
    {
        subject:{
            type:String,
            required:true
        },
        from:Date,
        to:Date,
        days:Number,
        status:{
            type:String,
            enum:["pending","approved","denied"],
            default:"pending"
        },
        approved:{
            type:Boolean,
            default:false
        },
        denied:{
            type:Boolean,
            default:false
        },
        user:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            username:String
        }
    }
    ,{ timestamps : {} }
);

module.exports=mongoose.model("Leave",LeaveSchema);