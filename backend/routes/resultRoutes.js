import express from 'express'
import { submitTest } from '../controllers/resultController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post("/submit", protect, submitTest)

export default router
