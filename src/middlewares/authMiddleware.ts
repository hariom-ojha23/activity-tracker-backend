import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/users'
import { NextFunction, Response } from 'express'
import { CustomRequest } from '../types/common'
import asyncHandler from 'express-async-handler'

const protect = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
            const { id } = decoded

            req.user = await User.findById(id).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Not authorised, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

export { protect }
