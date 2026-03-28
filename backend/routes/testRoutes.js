import express from 'express'
import { createTest } from '../controllers/testController.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()

router.post("/create", protect, createTest)


export default router
