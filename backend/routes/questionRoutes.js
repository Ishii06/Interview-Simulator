import express from 'express'
import { addQuestions, getQuestionsByTestId } from '../controllers/questionController.js'

const router = express.Router()

router.post('/add', addQuestions)
router.get('/:test_id', getQuestionsByTestId)

export default router
