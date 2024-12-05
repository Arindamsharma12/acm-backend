import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewar.js";
import { submitResponse } from "../controllers/userResponse.controller.js";
const router = Router();

router.route('/submit-response').post(verifyJWT,submitResponse);

export default router