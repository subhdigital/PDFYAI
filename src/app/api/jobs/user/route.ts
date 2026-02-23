import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { Job } from "@/lib/models";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const jobs = await Job.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error("Fetch user jobs error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
