import { Request } from "express"
import { ObjectId } from "mongodb"
import { User } from "../models/users"

export interface CustomRequest extends Request {
    user: User
}