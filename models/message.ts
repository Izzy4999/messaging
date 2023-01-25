import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    messages:{
        type: Array,
        default:[]
    },
    roomCode:{
        type:String,
        required:true
    }
})

const Message = mongoose.model("Message",messageSchema)

export{
    Message
}