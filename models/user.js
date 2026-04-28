import bcrypt from "bcryptjs";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "name is required"],
        trim : true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        lowercase : true,
        match: [/^\S+@\S+\.\S+$/, "Enter a valid email"],
        
    }, 
    password : {
        type : String,
        required : [true, "password is required"],
        minlength : 6,
        match: [/^[A-Za-z0-9]{6,}$/, "Password must be at least 6 characters"],
        select : false
    },
    role : {
        type : String,
        enum : ["ADMIN", "DOCTOR", "PATIENT"],
        default : "PATIENT"
    }
}, {
    timestamps : true
})



// pre save hooks => hash password before saving to db
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    // next()
})




// compare password
userSchema.methods.matchpassword =  async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}



const User = mongoose.model("User", userSchema)
export default User