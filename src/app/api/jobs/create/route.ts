import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Job } from "@/lib/models";
import { processJobLocally } from "@/lib/processor";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { type, inputKey, payload, userId } = await request.json();

        if (!type || !inputKey) {
            return NextResponse.json({ error: "Job type and inputKey are required" }, { status: 400 });
        }

        // Create job record in DB
        const dbJob = await Job.create({
            type,
            inputKey,
            payload: payload || {},
            status: "PENDING",
            userId: userId || undefined,
        });

        // Trigger local processing (non-blocking)
        processJobLocally(dbJob._id.toString());

        return NextResponse.json({
            jobId: dbJob._id.toString(),
            status: dbJob.status,
        });
    } catch (error: any) {
        console.error("Job creation error:", error);
        return NextResponse.json({ error: "Failed to create processing job" }, { status: 500 });
    }
}
