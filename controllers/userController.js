import User from "../models/user.js"
import jwt from "jsonwebtoken"

// generate a token 
const generateToken = (id, role) => {

        return jwt.sign({
            id , role
        }, 
        process.env.JWT_SECERT,
        {
            expiresIn : "7d"
        }
    
    )
}

// register new user
export const registerUser = async (req, res) => {
    

    try {
        const {name, email, password, role} = req.body

    // check if user exist
    const userExist = await User.findOne({email})

    if(userExist){
        return res.status(400).json({
            message : "User already exist",
            success : false
        })
    }

    if (!email || !password) {
    return res.status(400).json({
        success: false,
        message: "Email and password are required"
    })
}

    // create a new user

    const user = await User.create({
        name,
        email,
        password,
        role : role || "PATIENT"
    })

    return res.status(201).json({
        message : "User is created successfully",
        data : {
            id : user._id,
            name : user.name,
            // password : user.password,
            email : user.email,
            role : user.role
        }
        
    })

    } catch (error) {
        res.status(500).json({
            message : error.message,
            success : false
        })
    }

}

//login user

export const loginUser = async (req, res) => {


    try {

        // getting data
        const {email, password} = req.body   

         // check user if it exist
        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({
                message : "Email or user is not found",
                success : false
            })
        }

        if (!email || !password) {
    return res.status(400).json({
        success: false,
        message: "Email and password are required"
    })
}

        // matching password - must call on user instance
        const isPasswordMatch = await user.matchpassword(password)

        if(!isPasswordMatch){
            return res.status(401).json({
                message : "Invalid email or password",
                success : false
            })
        }

        // generate a token

        const token = generateToken(user._id, user.role)

        res.cookie("token", token, {
           httpOnly: true,
           sameSite: "lax",
           secure : false, 
           maxAge : 7 * 24 * 60 * 60 * 1000
        })

        // Send success response
        res.status(200).json({
            message : "Login successful",
            success : true,
            // token : token,
            data : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        })

    } catch (error) {
        res.status(500).json({
            message : error.message,
            success : false
        })
    }
 
}

//logout user
export const logoutUser = async(req, res) => {
    res.clearCookie("token", "",  {
    httpOnly: true,
    sameSite: "lax",
    secure: false
})
    res.status(200).json({
        message : "user is logout successfully",
        success : true
    })

}

