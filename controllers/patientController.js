import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/user.js";


// ==========================================
// ✅ CREATE PATIENT
// ==========================================
export const createPatient = async (req, res) => {
    try {

        const {
            name,
            age,
            phoneNo,
            gender,
            disease,
            admittedDate,
            doctorAssigned,
            email
        } = req.body;

        // ✅ validation
        if (
            !name ||
            !age ||
            !phoneNo ||
            !gender ||
            !disease ||
            !doctorAssigned ||
            !email
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // ✅ check doctor exists
        const doctor = await Doctor.findById(doctorAssigned);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Assigned doctor not found"
            });
        }

        // ✅ find patient user
        const user = await User.findOne({ email });

        if (!user || user.role !== "PATIENT") {
            return res.status(404).json({
                success: false,
                message: "Patient user not found. Please register patient first."
            });
        }

        // ✅ check if patient profile already exists
        const existingPatient = await Patient.findOne({
            user: user._id
        });

        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: "Patient profile already exists"
            });
        }

        // ✅ create patient
        const patient = await Patient.create({
            name,
            age,
            phoneNo,
            gender,
            disease,
            admittedDate,
            doctorAssigned,

            // ✅ patient account
            user: user._id,

            // ✅ admin/doctor who created patient
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Patient created successfully",
            data: patient
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Patient with this phone number already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================================
// ✅ GET PATIENTS (ROLE BASED)
// ==========================================
export const getPatients = async (req, res) => {
    try {

        let patients;

        // ✅ ADMIN → all patients
        if (req.user.role === "ADMIN") {

            patients = await Patient.find()
                .populate("doctorAssigned", "name specialization")
                .populate("createdBy", "name email role")
                .populate("user", "name email role");

        }

        // ✅ DOCTOR → assigned patients
        else if (req.user.role === "DOCTOR") {

            const doctor = await Doctor.findOne({
                createdBy: req.user._id
            });

            if (!doctor) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor profile not found"
                });
            }

            patients = await Patient.find({
                doctorAssigned: doctor._id
            })
                .populate("doctorAssigned", "name specialization")
                .populate("createdBy", "name email role")
                .populate("user", "name email role");

        }

        // ✅ PATIENT → own data
        else {

            patients = await Patient.find({
                user: req.user._id
            })
                .populate("doctorAssigned", "name specialization");

        }

        res.status(200).json({
            success: true,
            message: "Patients fetched successfully",
            count: patients.length,
            data: patients
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================================
// ✅ GET SINGLE PATIENT
// ==========================================
export const getSinglePatient = async (req, res) => {
    try {

        const patient = await Patient.findById(req.params.id)
            .populate("doctorAssigned", "name specialization")
            .populate("createdBy", "name email role")
            .populate("user", "name email role");

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================================
// ✅ UPDATE PATIENT
// ==========================================
export const updatePatient = async (req, res) => {
    try {

        const allowedFields = [
            "name",
            "age",
            "phoneNo",
            "gender",
            "disease",
            "admittedDate",
            "doctorAssigned"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Patient updated successfully",
            data: patient
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================================
// ✅ DELETE PATIENT
// ==========================================
export const deletePatient = async (req, res) => {
    try {

        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Patient deleted successfully",
            data: patient
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};