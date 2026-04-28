import Doctor from "../models/doctorModel.js";
import User from "../models/user.js"; 

export const createDoctor = async (req, res) => {
    try {
        const { name, specialization, experience, qualification, email } = req.body;

        if (!name || !specialization || !experience || !qualification || !email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user || user.role !== "DOCTOR") {
            return res.status(400).json({
                success: false,
                message: "Doctor user not found. Please register doctor first."
            });
        }

        const existingDoctor = await Doctor.findOne({ createdBy: user._id });

        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor profile already exists"
            });
        }

        const doctor = await Doctor.create({
            name,
            specialization,
            experience,
            qualification,
            email,
            createdBy: user._id   
        });

        res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            data: doctor
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Doctor with this email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//  GET ALL DOCTORS
export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate("createdBy", "name email role");

        res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//UPDATE DOCTOR
export const updateDoctor = async (req, res) => {
    try {
        const allowedFields = ["name", "specialization", "experience", "qualification", "email"];

        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            data: doctor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE DOCTOR
export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully",
            data: doctor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};