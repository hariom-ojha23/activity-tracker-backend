import asyncHandler from 'express-async-handler'
import { Request, Response } from "express"
import User from "../models/users"
import { generateToken } from '../utils/generateToken'
import { CustomRequest } from '../types/common'

// @desc    Sign up a new user
// @route   POST /api/users/signup
// @access  Public
// @body    name, email, password
const signUpUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('User already exist')
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'Admin'
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Sign in a user
// @route   POST /api/users/signin
// @access  Public
// @body    email, password
const signInUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        res.status(401)
        throw new Error('User does not exist')
    }

    if (user && await user.matchPassword(password)) {
        let authToken = generateToken({ id: user._id })

        res.cookie('auth_token', authToken, {
            httpOnly: true,
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profile_photo: user.profile_photo,
            role: user.role,
            organization: user.organization,
            verified: user.verified,
            token: authToken
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Get users profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: CustomRequest, res: Response) => {
    let { _id } = req.user
    const user = await User.findById(_id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profile_photo: user.profile_photo,
            role: user.role,
            verified: user.verified,
            organization: user.organization
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update users profile
// @route   PUT /api/users/profile
// @access  Private
// @body    name?, email?, password?, profile_photo?
const updateUserProfile = asyncHandler(async (req: CustomRequest, res: Response) => {
    let { _id } = req.user
    const user = await User.findById(_id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.profile_photo = req.body.profile_photo || user.profile_photo
        user.verified = req.body.verified || user.verified

        if (req.body.password) {
            user.password = req.body.password
        }

        let updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profile_photo: updatedUser.profile_photo,
            role: updatedUser.role,
            organization: updatedUser.organization,
            verified: updatedUser.verified,
            token: generateToken({id: user._id})
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export { signInUser, signUpUser, getUserProfile, updateUserProfile }