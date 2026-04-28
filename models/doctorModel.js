import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
   name : {
        type : String,
        required : true
   },

   specialization : {
         type : String,
         required : true
   },

   experience : {
        type : Number,
        required : true
   },   

   qualification : {
        type : String,
        required : true
   },

   email : {
        type : String,
        required : true,
        unique : true
   },

   createdBy : {
     type : mongoose.Schema.Types.ObjectId,
     ref : "User"
   }
}, 
  {
    timestamps : true
  }
)


const Doctor = mongoose.model("Doctor", doctorSchema)

export default Doctor