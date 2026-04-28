import express from 'express';

const router = express.Router();

import {
    createDoctor,
    deleteDoctor,
    getDoctors,
    updateDoctor
} from '../controllers/doctorController.js';

import { authorize, auth } from '../middleware/authMiddleware.js';



router.post('/', auth, authorize("ADMIN"), createDoctor);


router.get('/', auth, authorize("ADMIN"), getDoctors);


router.put('/:id', auth, authorize("ADMIN"), updateDoctor);

// ✅ DELETE doctor
router.delete('/:id', auth, authorize("ADMIN"), deleteDoctor);

export default router;