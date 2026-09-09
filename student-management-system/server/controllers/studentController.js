import mongoose from "mongoose";
import Student, { STATUS_OPTIONS } from "../models/Student.js";

// Small helper so route handlers stay free of try/catch boilerplate.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * GET /api/students
 * Query params:
 *   search   - matches fullName / studentId / email (case-insensitive)
 *   course   - exact course filter
 *   status   - Active | Inactive | Graduated
 *   page     - 1-indexed page number (default 1)
 *   limit    - page size (default 10, max 100)
 *   includeDeleted - "true" to include soft-deleted records (admin use)
 */
export const getStudents = asyncHandler(async (req, res) => {
  const {
    search = "",
    course = "",
    status = "",
    page = 1,
    limit = 10,
    includeDeleted = "false",
  } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const query = {};

  if (includeDeleted !== "true") {
    query.isDeleted = { $ne: true };
  }

  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [{ fullName: regex }, { studentId: regex }, { email: regex }];
  }

  if (course.trim()) {
    query.course = course.trim();
  }

  if (status.trim() && STATUS_OPTIONS.includes(status.trim())) {
    query.status = status.trim();
  }

  const [items, total] = await Promise.all([
    Student.find(query)
      .select("+isDeleted")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Student.countDocuments(query),
  ]);

  res.json({
    data: items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(Math.ceil(total / limitNum), 1),
    },
  });
});

// GET /api/students/:id
export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid student id." });
  }

  const student = await Student.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }
  res.json({ data: student });
});

// POST /api/students
export const createStudent = asyncHandler(async (req, res) => {
  const { fullName, studentId, email, course, enrollmentDate, status } =
    req.body;

  const student = await Student.create({
    fullName,
    studentId,
    email,
    course,
    enrollmentDate,
    status,
  });

  res.status(201).json({ data: student });
});

// PUT /api/students/:id
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid student id." });
  }

  const allowedFields = [
    "fullName",
    "studentId",
    "email",
    "course",
    "enrollmentDate",
    "status",
  ];
  const updates = {};
  for (const field of allowedFields) {
    if (field in req.body) updates[field] = req.body[field];
  }

  const student = await Student.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    updates,
    { new: true, runValidators: true }
  );

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  res.json({ data: student });
});

// DELETE /api/students/:id?hard=true
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hard = req.query.hard === "true";

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid student id." });
  }

  if (hard) {
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.json({ message: "Student permanently deleted.", data: deleted });
  }

  const student = await Student.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true }
  );

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  res.json({ message: "Student deactivated (soft delete).", data: student });
});

// GET /api/students/meta/summary  -> counts for dashboard stat cards
export const getStudentSummary = asyncHandler(async (req, res) => {
  const [total, active, graduated, courses] = await Promise.all([
    Student.countDocuments({ isDeleted: { $ne: true } }),
    Student.countDocuments({ isDeleted: { $ne: true }, status: "Active" }),
    Student.countDocuments({ isDeleted: { $ne: true }, status: "Graduated" }),
    Student.distinct("course", { isDeleted: { $ne: true } }),
  ]);

  res.json({
    data: {
      totalStudents: total,
      activeStudents: active,
      graduatedStudents: graduated,
      coursesOffered: courses.length,
      courseList: courses.sort(),
    },
  });
});
