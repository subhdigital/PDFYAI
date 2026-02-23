import mongoose, { Schema, Document, Model } from "mongoose";

// --- USER MODEL ---
export interface IUser extends Document {
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    password?: string;
    role: "USER" | "ADMIN";
}

const UserSchema = new Schema<IUser>({
    name: String,
    email: { type: String, unique: true, required: true },
    emailVerified: Date,
    image: String,
    password: { type: String, select: false },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema);

// --- JOB MODEL ---
export type JobType = "MERGE" | "SPLIT" | "COMPRESS" | "PDF_TO_WORD" | "WORD_TO_PDF" | "PDF_TO_JPG" | "JPG_TO_PDF" | "ROTATE" | "WATERMARK" | "PROTECT" | "UNLOCK" | "OCR";
export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface IJob extends Document {
    userId?: mongoose.Types.ObjectId;
    type: JobType;
    status: JobStatus;
    inputKey?: string;
    outputKey?: string;
    error?: string;
    payload?: any;
    processedAt?: Date;
}

const JobSchema = new Schema<IJob>({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    type: {
        type: String,
        enum: ["MERGE", "SPLIT", "COMPRESS", "PDF_TO_WORD", "WORD_TO_PDF", "PDF_TO_JPG", "JPG_TO_PDF", "ROTATE", "WATERMARK", "PROTECT", "UNLOCK", "OCR"],
        required: true
    },
    status: { type: String, enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"], default: "PENDING" },
    inputKey: String,
    outputKey: String,
    error: String,
    payload: Schema.Types.Mixed,
    processedAt: Date,
}, { timestamps: true });

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model("Job", JobSchema);
