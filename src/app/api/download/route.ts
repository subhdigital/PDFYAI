import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileName = searchParams.get("file");

        if (!fileName || fileName.includes("..") || fileName.includes("/")) {
            return new NextResponse("Invalid file request", { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "uploads", fileName);

        let fileBuffer;
        try {
            fileBuffer = await fs.readFile(filePath);
        } catch (e) {
            return new NextResponse("File not found on server.", { status: 404 });
        }

        const ext = path.extname(fileName).toLowerCase();
        let contentType = "application/octet-stream";

        if (ext === ".pdf") {
            contentType = "application/pdf";
        } else if (ext === ".docx") {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (ext === ".jpg" || ext === ".jpeg") {
            contentType = "image/jpeg";
        } else if (ext === ".png") {
            contentType = "image/png";
        }

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
        });
    } catch (error) {
        console.error("Download endpoint error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
