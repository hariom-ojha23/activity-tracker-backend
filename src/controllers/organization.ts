import asyncHandler from 'express-async-handler'
import Organization from '../models/organization'
import { CustomRequest } from '../types/common'
import { Response } from 'express'
import User from '../models/users'

// @desc    Add a new organization
// @route   POST /api/organization
// @access  Private
const addOrganization = asyncHandler(async (req: CustomRequest, res: Response) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }

    let orgExist = await Organization.findOne({ email: req.body.email })
    if (orgExist) {
        res.status(400)
        throw new Error('Organization already exist')
    }

    const org = await Organization.create({
        name: req.body.name,
        email: req.body.email,
        logo: req.body.logo,
        website: req.body.website,
        address: req.body.address,
        working_days: req.body.working_days,
        track_between: req.body.track_between
    })

    if (!org) {
        res.status(400)
        throw new Error('Invalid organization data')
    }
    user.organization = org._id
    await user.save()

    res.status(201).json({
        _id: org._id,
        name: org.name,
        email: org.email,
        logo: org.logo,
        website: org.website,
        address: org.address,
        working_days: org.working_days,
        track_between: org.track_between
    })
})

// @desc    Get organization
// @route   GET /api/organization
// @access  Private
const getOrganization = asyncHandler(async (req: CustomRequest, res: Response) => {
    const organization = await Organization.findOne()
})

const updateOrganization = asyncHandler(async (req: CustomRequest, res: Response) => {

})

export { addOrganization, getOrganization, updateOrganization }