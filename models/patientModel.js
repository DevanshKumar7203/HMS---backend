import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // ✅ Patient Name
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    // ✅ Age
    age: {
      type: Number,
      required: [true, "Age is required"],
    },

    // ✅ Phone Number
    phoneNo: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    // ✅ Gender
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: [true, "Gender is required"],
    },

    // ✅ Disease
    disease: {
      type: String,
      trim: true,
      required: [true, "Disease is required"],
    },

    // ✅ Admission Date
    admittedDate: {
      type: Date,
      default: Date.now,
    },

    // ✅ Assigned Doctor
    doctorAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // ✅ Actual Patient User Account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Who Created Record (ADMIN/DOCTOR)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;