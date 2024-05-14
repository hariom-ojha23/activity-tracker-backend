import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

export interface User extends Document {
    _id: ObjectId
    name: string
    email: string
    password: string
    profile_photo: string
    role: 'Admin' | 'Team Leader'
    organization: ObjectId
    verified: boolean
    forgot_password_token: string
    forgot_password_token_expiry: Date,
    verify_token: string
    verify_token_expiry: string
    matchPassword(enteredPassword: string): Promise<boolean>
    isModified(path?: string): boolean;
}

const userSchema = new mongoose.Schema<User>({
    name: { 
        type: String, 
        required: [true, 'Please provide a name']
    },
    email: {
        type: String, 
        required: [true, 'Please provide an email'],
        unique: true
    },
    password: { 
        type: String, 
        required: [true, 'Please provide a password']
    },
    profile_photo: {
        type: String,
        default: null
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Team Leader'], 
        required: [true, 'Please provide a role'] 
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    },
    forgot_password_token: String,
    forgot_password_token_expiry: Date,
    verify_token: String,
    verify_token_expiry: Date,
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function (
    this: User, 
    enteredPassword: string
) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre<User>('save', async function(next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model<User>('User', userSchema)

export default User