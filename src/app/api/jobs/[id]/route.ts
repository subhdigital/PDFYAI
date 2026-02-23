import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Job } from "@/lib/models";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        if (!id || id === "undefined") {
            return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
        }

        const job = await Job.findById(id);

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        let downloadUrl = null;
        if (job.status === "COMPLETED" && job.outputKey) {
            // Local URL for public/uploads directory
            downloadUrl = `/uploads/${job.outputKey}`;
        }

        return NextResponse.json({
            status: job.status,
            error: job.error,
            downloadUrl,
        });
    } catch (error: any) {
        console.error("Job status error:", error);
        return NextResponse.json({ error: "Failed to fetch job status" }, { status: 500 });
    }
}
