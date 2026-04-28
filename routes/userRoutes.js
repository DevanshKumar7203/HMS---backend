import { registerUser, loginUser, logoutUser } from "../controllers/userController.js";
import express from 'express'
import { auth, authorize } from "../middleware/authMiddleware.js";

const router = express.Router()

// user endpoints
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

router.get("/me", auth, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// router.post('/test', auth, authorize("ADMIN"), test)

export default router