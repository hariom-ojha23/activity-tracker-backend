import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import {
    getUserProfile, 
    signInUser, 
    signUpUser, 
    updateUserProfile 
} from '../controllers/users'

const router = express.Router()

router.route('/signup').post(signUpUser)
router.route('/signin').post(signInUser)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

export default router