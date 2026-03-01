import express from 'express'
import { createTest } from '../controllers/testController.js'
import { getTestById} from '../controllers/testController.js'
const router = express.Router()

router.get("/tests/:id", getTestById)
router.post('/create', createTest)


export default router
