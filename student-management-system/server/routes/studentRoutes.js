import { Router } from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentSummary,
} from "../controllers/studentController.js";

const router = Router();

router.get("/meta/summary", getStudentSummary);

router.route("/").get(getStudents).post(createStudent);

router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

export default router;
