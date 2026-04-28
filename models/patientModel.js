import mongoose from "mongoose";


const patientSchema =  new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : [true, "Name is required"]
    },

    age : {
        type : Number,
        required : true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
      },

    phoneNo : {
        type : String,
        trim : true,
        unique : true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },

    gender : {
        type : String,
        enum : ["Male", "Female", "Others"],
        required : true
    },

    disease : {
        type : String,
        required : true,
    },

    admittedDate : {
        type : Date,
        default : Date.now
    },

    doctorAssigned: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Doctor",
        required : true
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


const Patient = new mongoose.model('Patient', patientSchema)
export default Patient