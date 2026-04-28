import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";


// CREATE PATIENT
export const createPatient = async (req, res) => {
    try {
        const { name, age,email, phoneNo, gender, disease, admittedDate, doctorAssigned } = req.body;

        if (!name || !age || !email ||  !phoneNo || !gender || !disease || !doctorAssigned) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const doctor = await Doctor.findById(doctorAssigned);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Assigned doctor not found"
            });
        }

        const patient = await Patient.create({
            name,
            age,
            email,
            phoneNo,
            gender,
            disease,
            admittedDate,
            doctorAssigned,
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


// ✅ GET PATIENTS (ROLE BASED)
export const getPatients = async (req, res) => {
    try {
      let patients;
  
      // ADMIN - all patients
      if (req.user.role === "ADMIN") {
        patients = await Patient.find()
          .populate("doctorAssigned", "name specialization")
          .populate("createdBy", "name email");
      }
  
      //  DOCTOR - only assigned patients
      else if (req.user.role === "DOCTOR") {
        const doctor = await Doctor.findOne({ email: req.user.email });
  
        if (!doctor) {
          return res.status(404).json({
            success: false,
            message: "Doctor profile not found",
          });
        }
  
        patients = await Patient.find({
          doctorAssigned: doctor._id,
        })
          .populate("doctorAssigned", "name specialization")
          .populate("createdBy", "name email");
      }
  
      //  PATIENT - own data 
      else if (req.user.role === "PATIENT") {
        patients = await Patient.find({
          email: req.user.email, 
        }).populate("doctorAssigned", "name specialization");
      }
      
      else {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Patients fetched successfully",
        count: patients.length,
        data: patients,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };