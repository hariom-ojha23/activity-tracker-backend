import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import { addOrganization, getOrganization, updateOrganization } from '../controllers/organization'

const router = express.Router()

router
    .route('/')
    .post(protect, addOrganization)
    .get(protect, getOrganization)
    .put(protect, updateOrganization)

export default router