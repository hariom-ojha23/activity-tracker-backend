import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

interface GenerateTokenProps {
    id: ObjectId,
    name?: string,
    email?: string
}

export function generateToken({id, ...props}: GenerateTokenProps) {
    return jwt.sign({ id, ...props }, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })
}