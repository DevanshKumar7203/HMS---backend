import express from 'express';
const router = express.Router();

import { createPatient, getPatients } from '../controllers/patientController.js';
import { auth, authorize } from '../middleware/authMiddleware.js';


router.post('/', auth, authorize("ADMIN"), createPatient);

router.get('/', auth, getPatients);

export default router;