import mongoose from 'mongoose'

interface Organization {
    name: string;
    email: string;
    logo: string;
    website: string;
    address: string;
    working_days: string[];
    track_between: {
        start_time: Date;
        end_time: Date;
    };
}

const organizationSchema = new mongoose.Schema<Organization>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    working_days: [{ 
        type: String,
        default: null
    }],
    track_between: {
        start_time: { 
            type: Date,
            default: null
        },
        end_time: {
            type: Date,
            default: null
        }
    }
}, {
    timestamps: true
})

const Organization = mongoose.model<Organization>('Organization', organizationSchema)

export default Organization