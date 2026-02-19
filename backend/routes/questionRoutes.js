import express from 'express'
import { addQuestions } from '../controllers/questionController.js'

const router = express.Router()

router.post('/add', addQuestions)

export default router
