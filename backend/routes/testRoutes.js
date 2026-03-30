import express from 'express'
import { createTest, getTestHistory } from '../controllers/testController.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()

router.post("/create", protect, createTest)
router.get("/history", protect, getTestHistory)


export default router
