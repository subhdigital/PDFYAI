import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { Job, User } from "@/lib/models";

export async function GET() {
    try {
        const session = await auth();
        // In production, check for ADMIN role here
        // if (session?.user?.role !== "ADMIN") return ...

        await connectToDatabase();

        const [totalUsers, totalJobs, activeJobs, recentJobs] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Job.countDocuments({ status: "PROCESSING" }),
            Job.find().sort({ createdAt: -1 }).limit(10).populate("userId", "name email")
        ]);

        return NextResponse.json({
            stats: {
                totalUsers,
                totalJobs,
                activeJobs,
                health: "Good"
            },
            recentJobs
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
