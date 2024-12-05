import { Router } from "express";
import { createQuiz, getAllQuizzes, getQuizById, updateQuiz,deleteQuiz } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewar.js";
const quizRouter = Router();

quizRouter.route('/quizzes').post(verifyJWT,createQuiz);
quizRouter.route('/get-quizzes').get(getAllQuizzes)
quizRouter.route('/get-quiz/:id').get(getQuizById)
quizRouter.route('/update-quiz/:id').put(updateQuiz)
quizRouter.route('/delete-quiz/:id').delete(deleteQuiz)
export default quizRouter;