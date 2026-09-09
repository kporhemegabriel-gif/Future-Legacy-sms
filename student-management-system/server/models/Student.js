import mongoose from "mongoose";

const { Schema } = mongoose;

const STATUS_VALUES = ["Active", "Inactive", "Graduated"];

const studentSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 120,
    },
    studentId: {
      type: String,
      required: [true, "Student ID / Index number is required"],
      trim: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    course: {
      type: String,
      required: [true, "Major / Course is required"],
      trim: true,
    },
    enrollmentDate: {
      type: Date,
      required: [true, "Enrollment date is required"],
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: "Active",
    },
    // Soft-delete flag. Records are hidden from normal reads once true.
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

studentSchema.index({ fullName: "text", studentId: "text", email: "text" });

export const STATUS_OPTIONS = STATUS_VALUES;
export default mongoose.model("Student", studentSchema);
